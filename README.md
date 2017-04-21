# Batch Connect - OSC MATLAB

![GitHub Release](https://img.shields.io/github/release/osc/bc_osc_matlab.svg)
![GitHub License](https://img.shields.io/github/license/osc/bc_osc_matlab.svg)

A VNCSim app designed for OSC OnDemand that launches MATLAB within an Owens
batch job.

## Install

1. Git clone this app in the desired location and go into the directory:

   ```sh
   git clone <repo> bc_osc_matlab

   cd bc_osc_matlab
   ```

2. Checkout the version of the app you want to deploy:

   ```sh
   git checkout <tag>
   ```

3. Setup the app for use:

   ```sh
   bin/setup
   ```

## Update

1. Fetch the updated code:

   ```sh
   git fetch
   ```

2. Checkout the desired tag:

   ```sh
   git checkout <tag>
   ```

3. Setup the app for use:

   ```sh
   bin/setup
   ```

## Specification

### ROOT

All assets in this package look for dependencies in the specified `$ROOT`
directory. This should be set to correspond to the included `template/`
directory.

An example running the `xstartup` script included in this package:

```sh
# Path where you installed this project
BC_OSC_MATLAB_DIR="/path/to/bc_osc_matlab/template"

# Run the `xstartup` script with proper `$ROOT` set
ROOT="${BC_OSC_MATLAB_DIR}" ${BC_OSC_MATLAB_DIR}/xstartup
```

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
