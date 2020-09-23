# docs
Hermez documentation

**LICENSE**: https://creativecommons.org/licenses/by-nc-sa/4.0/

## Contributing
- Check the [style-guide.md](https://github.com/hermeznetwork/docs/blob/master/style-guide.md)
- All `master` branch commits are served at https://docs.hermez.io
- Before creating a new PR, check that the changes added are correctly visualized in the browser

## Local usage

In order to use and visualize the result in a local machine you need node and
npm installed.  Then run the `serve.sh` script, which will install docsify if
it's not installed and start serving the documentation:

```
./dev-serve.sh
```

This will serve the documentation website in a local port, reloading the
webpage each time that a file is updated.

If you don't want to install npm and node you can use docker instead: `./dev-serve.sh docker`.

More details: https://docsify.js.org/#/quickstart

## Deploying on server

- just need to download this repository
```
git clone https://github.com/hermeznetwork/docs.git
```

- then run:
```
./git-update.sh
```
This will automatically pull new commits added to this repo, to have always in
the server the last version of this docs repositoy.

- run the server:
```
./serve.sh
```
This will serve the documentation website in a local port, reloading the
webpage each time that a file is updated.
