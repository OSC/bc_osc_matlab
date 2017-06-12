# Batch Connect - OSC MATLAB

![GitHub Release](https://img.shields.io/github/release/osc/bc_osc_matlab.svg)
![GitHub License](https://img.shields.io/github/license/osc/bc_osc_matlab.svg)

A Batch Connect app designed for OSC OnDemand that launches MATLAB within an
Owens batch job.

## Prerequisites

This app requires the following software be installed on the nodes that the
batch job is intended to run on:

- [MATLAB](https://www.mathworks.com/) R2016b+
- [Lmod](https://www.tacc.utexas.edu/research-development/tacc-projects/lmod) 6.0.1+
- [Fluxbox](http://fluxbox.org/) 1.1.1+

For VNC server support:

- [TurboVNC](http://www.turbovnc.org/) 2.1+
- [websockify](https://github.com/novnc/websockify) 0.8.0+

## Install

Use git to clone this app and checkout the desired branch/version you want to
use:

```sh
scl enable git19 -- git clone <repo>
cd <dir>
scl enable git19 -- git checkout <tag/branch>
```

You will not need to do anything beyond this as all necessary assets are
installed. You will also not need to restart this app as it isn't a Passenger
app.

To update the app you would:

```sh
cd <dir>
scl enable git19 -- git fetch
scl enable git19 -- git checkout <tag/branch>
```

Again, you do not need to restart the app as it isn't a Passenger app.

## Template Specification

### MATLAB_MODULE

This environment variable describes the specific MATLAB version to load. This
also assumes module support through the
[Lmod](https://www.tacc.utexas.edu/research-development/tacc-projects/lmod)
package manager is installed on the running compute node as well as the
requested module in `$MATLAB_MODULE`.

## Contributing

1. Fork it ( https://github.com/OSC/bc_osc_matlab/fork )
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create a new Pull Request
