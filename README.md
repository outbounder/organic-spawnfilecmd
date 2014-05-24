# organic-spawnfilecmd

Organelle for spawning command targeting/using file for transformations or manipulations

## dna / reaction chemical

    {
      data: {
        path: "full/path/to/root/folder/with/file"
      },
      "dest": "relative/path/to/cwd/as/destination/folder",
      "root": "path/to/root/folder",
      "cmd": "command to be executed with {srcfile} and {destfile} placeholders replaced",
      "name": "optional name of spawned child"
    }

## reacts to `dna.reactOn`

In case `dna.reactOn` is empty, once organelle is build it uses provided dna as reaction chemical
and executes `cmd`. 

Note that having `root` and `dest` properties forces the organelle to create recursively containing folder of `destfile`

## reacts to `kill` chemical type

Terminates spawned file command.