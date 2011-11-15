##About
Alexandria is tool to organize a digital movie collection in the filesystem. 
Organization is done with symlinks.
Information is obtained dynamically from [IMDB](http://www.imdb.com).

##Installation
Alexandria depends on [nodejs](http://nodejs.org) and some modules (express, socket.io and others). 
These modules are included.

- Install nodejs
- execute `node app.js`
- open [http://localhost:3000](http://localhost:3000) in your browser

##Configuration

The configuration is stored in `public/javascripts/config.js`

##Usage
- Open [http://localhost:3000](http://localhost:3000) in your browser
- Select a video file in the file tree
- Enter the matching IMDB url in the IMDB section, e. g. `http://www.imdb.com/title/tt0114814/`
- Click `search`
- Change filename as you please. (Please note that whitespaces and 
  other special chars will automatically be converted to dots. E. g. 
  `The Usual Suspects.mkv` becomes `The.Usual.Suspects.mkv`) 
  See [`lib/makeCleanFilename.js`](https://github.com/pschultz/alexandria/blob/master/lib/makeCleanFilename.js) 
  for details.
- Select which symlinks to create
- Ignore the IMDB rating link, this is not functional right now
- Ignore the Trailer section, this is not functional right now
- Click Submit
    
Your video file will be moved to `${fsRoot}/${videoDirname}/all/${filename}`.
See [the config file](https://github.com/pschultz/alexandria/blob/master/public/javascripts/config.js) for details.
Symlinks are created in `${fsRoot}/${videoDirname}/{Actor,Director,Year,IMDB-Rating}`. 

Please note that there is currently no feedback for the submit action. 
I recommend you keep a file browser at hand or refresh the file system tree 
within Alexandria after submitting the form.


## License
![cc-by-sa-30](http://i.creativecommons.org/l/by-sa/3.0/de/88x31.png)

<http://creativecommons.org/licenses/by-sa/3.0/>


