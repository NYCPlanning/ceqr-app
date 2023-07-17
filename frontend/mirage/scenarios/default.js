export default function (server) {
  /*
    Seed your development database using your factories.
    This data will not be loaded in your tests.
  */

  server.create('bbl');
  server.create('project');
  server.create('user');
}
