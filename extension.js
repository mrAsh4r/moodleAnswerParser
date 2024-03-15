// ==UserScript==
// @name         Moodle Question Parser
// @namespace    https://github.com/
// @version      1.0
// @description  Parse questions and answers on Moodle pages
// @author       Roman
// @match        https://skpdo-surgut.ru/mod/quiz/attempt.php*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    // Функция для парсинга вопросов и ответов
    function parseQuestionsAndAnswers() {
        // Найдем все блоки с вопросами
        var questionBlocks = document.querySelectorAll('.formulation.clearfix');

        // Перебираем каждый блок с вопросом
        questionBlocks.forEach(function(questionBlock) {
            // Извлекаем текст вопроса
            var questionText = questionBlock.querySelector('.qtext').textContent.trim();


            // Отправляем запрос на сервер для получения ответов
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'http://185.252.146.154:5000/parse_question',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    question: questionText
                }),
                onload: function(response) {
                    // Получаем ответы и делаем что-то с ними
                    var data = JSON.parse(response.responseText);
                    console.log(data);

                    // Подсвечиваем правильные ответы и добавляем галочку
                    var correctAnswers = data.answers[0][0];
                    console.log(correctAnswers)
                    correctAnswers.forEach(function(answer) {
                        var answerElements = questionBlock.querySelectorAll('.answer label');
                        answerElements.forEach(function(answerElement) {
                            var labelContent = answerElement.textContent.trim();
                            var match = labelContent.match(/^[a-z]\.\s*(.*)/i); // Находим префикс типа "a. ", "b. " и т.д.
                            if (match && match[1] === answer) {
                                answerElement.style.backgroundColor = 'lightgreen';
                                var tickElement = document.createElement('span');
                                tickElement.innerHTML = '&#10004;';
                                tickElement.style.color = 'green';
                                answerElement.appendChild(tickElement);
                            }
                        });
                    });
                }
            });
        });
    }

    // Вызываем функцию парсинга вопросов и ответов
    parseQuestionsAndAnswers();

})();
