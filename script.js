// Initialize data
let users = JSON.parse(localStorage.getItem('users')) || [];
let quizzes = JSON.parse(localStorage.getItem('quizzes')) || [];
let currentUser = null;

document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('currentUser')) {
    currentUser = JSON.parse(localStorage.getItem('currentUser'));
    showDashboard();
  } else {
    showRegister();
  }
 
});


function showRegister() {
  document.getElementById('register').classList.remove('hidden');
  document.getElementById('login').classList.add('hidden');
  document.getElementById('dashboard').classList.add('hidden');
  document.getElementById('createQuiz').classList.add('hidden');
  document.getElementById('takeQuiz').classList.add('hidden');
  
}

function showLogin() {
  document.getElementById('register').classList.add('hidden');
  document.getElementById('login').classList.remove('hidden');
  document.getElementById('dashboard').classList.add('hidden');
  document.getElementById('createQuiz').classList.add('hidden');
  document.getElementById('takeQuiz').classList.add('hidden');
  
}

function showDashboard() {
  document.getElementById('register').classList.add('hidden');
  document.getElementById('login').classList.add('hidden');
  document.getElementById('dashboard').classList.remove('hidden');
  document.getElementById('createQuiz').classList.add('hidden');
  document.getElementById('takeQuiz').classList.add('hidden');
}

function showCreateQuiz() {
  document.getElementById('register').classList.add('hidden');
  document.getElementById('login').classList.add('hidden');
  document.getElementById('dashboard').classList.add('hidden');
  document.getElementById('createQuiz').classList.remove('hidden');
  document.getElementById('takeQuiz').classList.add('hidden');
}

function showTakeQuiz() {
  document.getElementById('register').classList.add('hidden');
  document.getElementById('login').classList.add('hidden');
  document.getElementById('dashboard').classList.add('hidden');
  document.getElementById('createQuiz').classList.add('hidden');
  document.getElementById('takeQuiz').classList.remove('hidden');

  const quizList = document.getElementById('quizList');
  quizList.innerHTML = '';
  quizzes.forEach((quiz, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = quiz.title;
    quizList.appendChild(option);
  });
}

document.getElementById('registerForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const username = document.getElementById('registerUsername').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;

  if (users.some(user => user.email === email)) {
    alert('User already exists');
    return;
  }

  const newUser = { username, email, password };
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  alert('Registration successful');
  showLogin();
});

document.getElementById('loginForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  const user = users.find(user => user.email === email && user.password === password);
  if (!user) {
    alert('Invalid credentials');
    return;
  }

  currentUser = user;
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  showDashboard();
});

document.getElementById('createQuizForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('quizTitle').value;
  const questionElements = document.querySelectorAll('.question');
  const questions = Array.from(questionElements).map((questionElement, index) => {
    const questionText = questionElement.querySelector('.questionText').value;
    const answerElements = questionElement.querySelectorAll('.answerText');
    const answers = Array.from(answerElements).map((answerElement, answerIndex) => ({
      answerText: answerElement.value,
      isCorrect: questionElement.querySelector(`input[name="correctAnswer${index}"]:checked`).value == answerIndex
    }));
    return { questionText, answers };
  });

  const newQuiz = { title, questions, createdBy: currentUser.email };
  quizzes.push(newQuiz);
  localStorage.setItem('quizzes', JSON.stringify(quizzes));
  alert('Quiz created successfully');
  showDashboard();
});

document.getElementById('quizListForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const quizIndex = document.getElementById('quizList').value;
  const quiz = quizzes[quizIndex];
  const quizContainer = document.getElementById('quizContainer');
  quizContainer.classList.remove('hidden');

  const quizForm = document.getElementById('quizForm');
  quizForm.innerHTML = '';
  quiz.questions.forEach((question, questionIndex) => {
    const questionDiv = document.createElement('div');
    questionDiv.classList.add('question');
    const questionLabel = document.createElement('label');
    questionLabel.textContent = question.questionText;
    questionDiv.appendChild(questionLabel);
    question.answers.forEach((answer, answerIndex) => {
      const answerDiv = document.createElement('div');
      const answerInput = document.createElement('input');
      answerInput.type = 'radio';
      answerInput.name = `question${questionIndex}`;
      answerInput.value = answerIndex;
      answerDiv.appendChild(answerInput);
      const answerLabel = document.createElement('label');
      answerLabel.textContent = answer.answerText;
      answerDiv.appendChild(answerLabel);
      questionDiv.appendChild(answerDiv);
    });
    quizForm.appendChild(questionDiv);
  });
});

function submitQuiz() {
  const quizIndex = document.getElementById('quizList').value;
  const quiz = quizzes[quizIndex];
  const quizForm = document.getElementById('quizForm');
  const formData = new FormData(quizForm);

  let score = 0;
  quiz.questions.forEach((question, questionIndex) => {
    const selectedAnswerIndex = formData.get(`question${questionIndex}`);
    if (question.answers[selectedAnswerIndex].isCorrect) {
      score++;
    }
  });

  alert(`Your score: ${score}/${quiz.questions.length}`);
  showDashboard();
}

function addQuestion() {
  const questionsContainer = document.getElementById('questionsContainer');
  const questionIndex = questionsContainer.querySelectorAll('.question').length;
  const questionDiv = document.createElement('div');
  questionDiv.classList.add('question');
  questionDiv.innerHTML = `
    <label>Question</label>
    <input type="text" class="questionText" required>
    <label>Answer 1</label>
    <input type="text" class="answerText" required>
    <input type="radio" name="correctAnswer${questionIndex}" value="0" required>
    <label>Answer 2</label>
    <input type="text" class="answerText" required>
    <input type="radio" name="correctAnswer${questionIndex}" value="1" required>
    <label>Answer 3</label>
    <input type="text" class="answerText" required>
    <input type="radio" name="correctAnswer${questionIndex}" value="2" required>
    <label>Answer 4</label>
    <input type="text" class="answerText" required>
    <input type="radio" name="correctAnswer${questionIndex}" value="3" required>
  `;
  questionsContainer.appendChild(questionDiv);
}

function logout() {
  currentUser = null;
  localStorage.removeItem('currentUser');
  showRegister();
}



