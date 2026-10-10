import { pool } from '../config/database.js';
import { AppError } from '../errors/appError.js';
import { CreateTeamInput, InviteMemberInput } from '../schemas/teamSchema.js';

export const createTeam = async (userId: string, input: CreateTeamInput) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Create the team
    const teamResult = await client.query(
      'INSERT INTO teams (name) VALUES ($1) RETURNING id, name, created_at',
      [input.name]
    );
    const team = teamResult.rows[0];

    // 2. Assign creator as ADMIN in team_members
    await client.query(
      'INSERT INTO team_members (user_id, team_id, role) VALUES ($1, $2, $3)',
      [userId, team.id, 'ADMIN']
    );

    await client.query('COMMIT');
    return team;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const inviteMemberToTeam = async (teamId: string, input: InviteMemberInput) => {
  const { email, role } = input;

  // 1. Find user by email
  const userResult = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
  if (userResult.rows.length === 0) {
    throw new AppError('User with this email does not exist', 404);
  }
  const userId = userResult.rows[0].id;

  // 2. Check if already a member
  const memberCheck = await pool.query(
    'SELECT * FROM team_members WHERE user_id = $1 AND team_id = $2',
    [userId, teamId]
  );
  if (memberCheck.rows.length > 0) {
    throw new AppError('User is already a member of this team', 400);
  }

  // 3. Add to team_members
  await pool.query(
    'INSERT INTO team_members (user_id, team_id, role) VALUES ($1, $2, $3)',
    [userId, teamId, role]
  );

  return { message: 'User successfully added to team', email, role };
};