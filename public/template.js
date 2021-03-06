export default function(preloadedState) {
	return `
	<!doctype html>
	<html lang="en">
	  <head>
	    <meta charset="utf-8">
	    <meta name="viewport" content="width=device-width, initial-scale=1">
	    <title>jsPsych Experiment Builder</title>
	    <link rel="shortcut icon" href="./jsPsych/jspsych-favicon.png">
	    <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css">
	    <link rel="stylesheet" href="./style.css">
	    <link href="./jsPsych/jspsych.css" rel="stylesheet" type="text/css"></link>
	    <script type="text/javascript" src="./jsPsych/jspsych.min.js"></script>
	  </head>
	  <body class='canvas'>
	    <div id="container" ></div>
	  </body>
	  <script>
          window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\x3c')}
      </script>
	  <script src="/static/bundle.js"></script>
	</html>
    `
}


