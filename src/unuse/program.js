const program = require('commander')
program
.version('0.1.0')
.arguments('<username> [password]')
.description('test command', {
  username: 'user to login',
  password: 'password for user, if required'
})
.action((username, password) => {
  console.log('username:', username);
  console.log('environment:', password || 'no password given');
});
var prompt = require('prompt');

  //
  // Start the prompt
  //
  prompt.start();

  //
  // Get two properties from the user: username and email
  //
  prompt.get(['username', 'email'], function (err, result) {
    //
    // Log the results.
    //
    console.log('Command-line input received:');
    console.log('  username: ' + result.username);
    console.log('  email: ' + result.email);
  });