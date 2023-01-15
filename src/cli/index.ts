#!/usr/bin/env node

import { program } from "./lib/program";

program
  .command("stock", "check the availability of one or multiple product(s)", {
    executableFile: "index-stock",
    isDefault: true,
  })
  .command("stores", "list stores in one or more countries", {
    executableFile: "index-stores",
  })
  .parse();
