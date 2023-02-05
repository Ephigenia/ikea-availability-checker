import { Command } from "commander";
import * as pkg from "./../../../package.json";

/** Basec Commander Program used by all sub-commands */
const program = new Command();
program.version(pkg.version).description(pkg.description);

export { program };
