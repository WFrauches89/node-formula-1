import fastify from 'fastify';
import cors from '@fastify/cors';

const server = fastify({ logger: true });

server.register(cors, {
  origin: '*',
});

const teams = [
  { id: 1, name: 'McLaren', base: 'Woking, United Kingdom' },
  { id: 2, name: 'Mercedes', base: 'Brackley, United Kingdom' },
  { id: 3, name: 'Red Bull Racing', base: 'Milton Keynes, United Kingdom' },
  { id: 4, name: 'Ferrari', base: 'Maranello, Italy' },
  { id: 5, name: 'Alpine', base: 'Enstone, United Kingdom' },
  { id: 6, name: 'Aston Martin', base: 'Silverstone, United Kingdom' },
  { id: 7, name: 'Alfa Romeo Racing', base: 'Hinwil, Switzerland' },
  { id: 8, name: 'AlphaTauri', base: 'Faenza, Italy' },
  { id: 9, name: 'Williams', base: 'Grove, United Kingdom' },
  { id: 10, name: 'Haas', base: 'Kannapolis, United States' },
  { id: 11, name: 'Uralkali Haas F1 Team', base: 'Banbury, United Kingdom' },
  { id: 12, name: 'Scuderia Toro Rosso', base: 'Faenza, Italy' },
];

const drivers = [
  { id: 1, name: 'Max Verstappen', team: 'Red Bull Racing' },
  { id: 2, name: 'Lewis Hamilton', team: 'Ferrari' },
  { id: 2, name: 'Lando Norris', team: 'McLaren' },
];

server.get('/teams', async (request, response) => {
  response.type('application/json').code(200);
  return { teams };
});

server.get('/drivers', async (request, response) => {
  response.type('application/json').code(200);
  return { drivers };
});

interface DriverParams {
  id: string;
}

server.get<{ Params: DriverParams }>(
  '/drivers/:id',
  async (request, response) => {
    const id = parseInt(request.params.id);
    const driver = drivers.find((d) => d.id === id);

    if (!driver) {
      response.type('application/json').code(404);
      return { message: 'Driver Not Found' };
    } else {
      response.type('application/json').code(200);
      return { driver };
    }
  },
);

interface TeamsParams {
  id: string;
  name: string;
  base: string;
}

server.get<{ Params: TeamsParams }>(
  '/teams/:name',
  async (request, response) => {
    const name = request.params.name;

    const team = teams.find((t) => t.name.toLowerCase() === name.toLowerCase());

    if (!team) {
      response.type('application/json').code(404);
      return { message: name + ' Team Not Found' };
    } else {
      response.type('application/json').code(200);
      return { team };
    }
  },
);

server.post<{ Body: TeamsParams }>('/teams', async (request, reply) => {
  const { name, base } = request.body;

  if (!name || !base) {
    return reply
      .status(400)
      .send({ error: 'Name and base are required fields.' });
  }

  const newId = teams.length ? teams[teams.length - 1].id + 1 : 1;

  const newTeam = { id: newId, name, base };
  teams.push(newTeam);

  return reply.status(201).send(newTeam);
});

server.delete<{ Params: TeamsParams }>('/teams/:id', async (request, reply) => {
  const id = parseInt(request.params.id);

  const teamIndex = teams.findIndex((team) => team.id === id);

  if (teamIndex === -1) {
    return reply.status(404).send({ error: 'Team not found.' });
  }

  const deletedTeam = teams.splice(teamIndex, 1)[0];

  return reply
    .status(200)
    .send({ message: 'Team deleted successfully.', team: deletedTeam });
});

server.listen({ port: 3333 }, () => {
  console.log('Server init');
});
