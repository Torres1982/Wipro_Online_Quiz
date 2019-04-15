var hours = 0;
var minutes = 0;
var seconds = 0;
var currentQuestion = 0;
var nextQuestionNumber = 1;
var selectedAnswer = 0;
var questionId = 0;
var arrayOfUserAnswers = [];

function startQuiz() {
	var button = document.getElementById("counter-button").value;

	switch(button) {
		case  "Finish Quiz":
			window.clearInterval(timerInterval);
			document.getElementById("counter-button").value = "Start Quiz";
			document.getElementById("counter-button").disabled = true;
			document.getElementById("result-button").style.display = "inline";
			//currentQuestion = 0;
		break;
		case  "Start Quiz":
			displayQuestion(questionId);
			timerInterval = window.setInterval("displayCounter()", 1000);
			document.getElementById("counter-button").value = "Finish Quiz";
			document.getElementById("counter-button").disabled = true;
			document.getElementById("next-button").disabled = false;
		break;
	}
}

// Show the Counter
function displayCounter() {
	var newSeconds = 0;
	var mewMinutes = 0;
	var newHours = 0;

	seconds < 10 ? newSeconds = "0" + seconds : newSeconds = seconds;
	minutes < 10 ? mewMinutes = "0" + minutes : mewMinutes = minutes;
	hours < 10 ? newHours = "0" + hours : newHours = hours;

	// Display the Timer
	document.getElementById("timer").innerHTML = newHours + ':' + mewMinutes + ':' + newSeconds;

	// Find out whole SECONDS, MINUTES
	seconds < 59 ? seconds = seconds + 1 : (seconds = 0, minutes = minutes +1);
}

// Display Questions from the pool of qustions
function displayQuestion(questionId) {
	//console.log(JSONObject.questions);
	var jsonObject = JSON.parse(jsonArrayQuestion());
	var id = jsonObject.questions[questionId].id;
	var question = jsonObject.questions[questionId].question;
	var answerOne = jsonObject.questions[questionId].answer_one;
	var answerTwo = jsonObject.questions[questionId].answer_two;
	var answerThree = jsonObject.questions[questionId].answer_three;
	var answerFour = jsonObject.questions[questionId].answer_four;
	//var correctAnswer = jsonObject.questions[questionId].correct_answer;
	currentQuestion++;
	console.log(id, question, answerOne, answerTwo, answerThree, answerFour);
	console.log("Current Question: " + currentQuestion);

	document.getElementById("questions-section").innerHTML = "<div id='" + id + "'class='questions'><strong> " + question + "</strong></div>" +
			"<div><label for='first-answer'><input type='radio' id='first-answer' name='radio-questions' value='1'> " + answerOne + "</label></div>" +
			"<div><label for='second-answer'><input type='radio' id='second-answer' name='radio-questions' value='2'> " + answerTwo + "</label></div>" +
			"<div><label for='third-answer'><input type='radio' id='third-answer' name='radio-questions' value='3'> " + answerThree + "</label></div>" +
			"<div><label for='fourth-answer'><input type='radio' id='fourth-answer' name='radio-questions' value='4'> " + answerFour + "</label></div>";
	
	nextQuestionNumber = currentQuestion + 1;
	console.log("Next Question Number: " + nextQuestionNumber);
}

// Load next Question
function nextQuestion() {
	questionId++;
	selectedAnswer = $("input[name='radio-questions']:checked").val();
	
	if (typeof selectedAnswer === "undefined") {
		alert("Please Select One Answer!");
	} else {
		//alert(selectedAnswer);
		displayQuestion(currentQuestion);
		saveAnswers(questionId, selectedAnswer); // Save selected User's answers in an array

		if (currentQuestion == 5) {
			document.getElementById("counter-button").disabled = false;
			document.getElementById("next-button").disabled = true;
		}
	}
}

// Check the result of the Quiz
function checkResult() {
	questionId++;
	selectedAnswer = $("input[name='radio-questions']:checked").val();
	saveAnswers(questionId, selectedAnswer);
	document.getElementById("result-button").style.display = "none";
	document.getElementById("counter-button").style.display = "none";
	document.getElementById("next-button").style.display = "none";
	//alert(arrayOfUserAnswers);
	displayQuizResults();
}

// Save all answers in the array of user answers
function saveAnswers(questionId, userAnswer) {
	arrayOfUserAnswers.push(userAnswer);
	console.log("Question ID: " + questionId + " - User Answer: " + userAnswer);
}

// Show all the User's quiz answers
function displayQuizResults() {
	//document.getElementById("timer").innerHTML = '00:00:00'; // Reset the counter
	var htmlOutput = "";
	var jsonObject = JSON.parse(jsonArrayQuestion());
	//var id = jsonObject.questions[questionId].id;
	
	for (var i = 0; i < arrayOfUserAnswers.length; i++) {
		//alert(jsonObject.questions[i].correct_answer);
		var question = jsonObject.questions[i].question;
		var correctAnswer = jsonObject.questions[i].correct_answer;
		var userAnswer = arrayOfUserAnswers[i];
		var imageSource = "";
		
		if (correctAnswer == userAnswer) {
			imageSource = "icon_correct.png";
		} else {
			imageSource = "icon_incorrect.png";
		}
		
		htmlOutput = htmlOutput.concat("<div class='answers'><strong> " + question + "</strong></div>" + 
									   "<div>Correct Answer: " + correctAnswer + "</div>" +
									   "<div>Your Answer: " + userAnswer + " <img src='" + imageSource + "' alt='Icon' height='25' width='25'></div>");
	}
	var userMark = calculateMarkOfCorrecAnswers();
	var isPassed;
	userMark < 80 ? isPassed = "<div id='quiz_result_failed'>You Failed!</div>" : isPassed = "<div id='quiz_result_passed'>Congratulations! You Passed!</div>";
	
	document.getElementById("questions-section").innerHTML = "<div><h3 style='text-align:center; color:red;'>Your Result - " + userMark + "\%</h3>" + isPassed + "</div>" + htmlOutput;
	document.getElementById("reset-button").style.display = "inline";
}

// Calculate the User's Mark
function calculateMarkOfCorrecAnswers() {
	var correctAnswerCounter = 0;
	var jsonObject = JSON.parse(jsonArrayQuestion());
	var correctAnswer;
	var userAnswer;
	
	for (var i = 0; i < arrayOfUserAnswers.length; i++) {
		correctAnswer = jsonObject.questions[i].correct_answer;
		userAnswer = arrayOfUserAnswers[i];
		
		if (correctAnswer == userAnswer) {
			correctAnswerCounter++;
		}
	}
	return ((correctAnswerCounter / arrayOfUserAnswers.length) * 100);
}

// Reload the Page to retake the Quiz
function retakeQuiz() {
	location.reload();
}

// Display the next question in the queue
function jsonArrayQuestion() {
	var questions = '{"questions": [' +
		'{' +
			'"id":0,' +
			'"question":"1. What is Java Script?",' +
			'"answer_one":"Second Planet of the Solar System",' +
			'"answer_two":"Popular Scotish footballer",' +
			'"answer_three":"Programming language for the Web",' +
			'"answer_four":"One of the best clothing brnads",' +
			'"correct_answer":"3"' +
		'},' +
		'{' +
			'"id":1,' +
			'"question":"2. How can you access an HTML element with Java script?",' +
			'"answer_one":"With the use of document.getElementById(id)",' +
			'"answer_two":"With the use of window.getElementsById(id)",' +
			'"answer_three":"With the use of file.getElementsByName(id)",' +
			'"answer_four":"It is impossible to access an HTML element",' +
			'"correct_answer":"1"' +
		'},' +
		'{' +
			'"id":2,' +
			'"question":"3. Which operator assigns a value to a variable?",' +
			'"answer_one":"===",' +
			'"answer_two":"=",' +
			'"answer_three":"=>",' +
			'"answer_four":"None of them",' +
			'"correct_answer":"2"' +
		'},' +
		'{' +
			'"id":3,' +
			'"question":"4. Which arithmetic operator can you use to get a reminder from operands\' division?",' +
			'"answer_one":"Multiplication (*)",' +
			'"answer_two":"Exponentiation​ (**)",' +
			'"answer_three":"Division (/)",' +
			'"answer_four":"Modulus (%)",' +
			'"correct_answer":"4"' +
		'},' +
		'{' +
			'"id":4,' +
			'"question":"5. How can you replace the assignment: x = x + 10?",' +
			'"answer_one":"x + 10 = 10",' +
			'"answer_two":"x += 10",' +
			'"answer_three":"x / 10 = 2",' +
			'"answer_four":"x = x ** 10",' +
			'"correct_answer":"2"' +
		'}' +
	']}';
	return questions;
}
