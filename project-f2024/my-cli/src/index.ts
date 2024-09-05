import { Command } from "commander";
const program = new Command();

program
  .version("1.0.0")
  .description("A simple CLI")
  .command("install")
  .description("Install something")
  .action(() => {
    console.log("Running install command");
  });

program.parse(process.argv);
