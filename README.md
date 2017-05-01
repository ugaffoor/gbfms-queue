# Request CE Bundle: Queue

## Summary

Queue is a kapp designed to contain "queues" of items to be worked on. By default it will show all submissions for all forms in its kapp of the Queue Type defined.

Additional Filters can be added in order to narrow down the visible queue items.

### Queue Form Management

If you need to create a template from scratch the following fields are necessary:

* Assigned Individual
* Assigned Individual Display Name
* Assigned Group
* Assigned Group Display Name
* Deferral Token
* Due Date (Date field type)
* Status - Statuses are arbitrary but by default we use Open, Pending, In Progress, and Complete.

All other fields are optional. The description at the top of the list view item and the title-bar of the detail view is the submission label.

## Development

Developers working on Queue should create a feature branch off of the *develop* branch. No new development should be done on the *master* branch. Quick fixes can be developed directly against the *develop* branch.

### Setup

You will need an up-to-date Node.JS installation (6.10.x) and Yarn installed globally. You will need this bundle configured to run on a Kinetic Core instance, in the proper bundle location so that content is served using this bundle's *kapp.jsp*.

### Mac OSX

1. Install *brew* if it is not already installed.
2. Verify your Node.JS version by running *node --version*
3. *brew install node* if *node* was an unknown command, *brew upgrade node* if it is out of date.
4. *brew install yarn*
5. By default the development server will run on port 4000 and will point at a kinops.io - change these by editing the *webpack.config.js*. At the bottom of the file will be a key *devServer* where these options can be changed.
6. Run *yarn start* to start the development server.
7. Browse to http://localhost:4000/space-slug/queue to see your local development environment.
8. If changes are made to the webpack config you will need to restart the server.

### Windows

If you are on Windows you will want to install Chocolatey (https://chocolatey.org/) and then use it to install NodeJS (either *choco install node* or *choco upgrade node*) and Yarn (*choco install yarn*).

Everything from step 5 forward from the _Mac OSX_ instructions will apply to Windows as well.
