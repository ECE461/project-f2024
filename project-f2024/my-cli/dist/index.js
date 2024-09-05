"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const program = new commander_1.Command();
program
    .version("1.0.0")
    .description("A simple CLI")
    .command("install")
    .description("Install something")
    .action(() => {
    console.log("Running install command");
});
program.parse(process.argv);
