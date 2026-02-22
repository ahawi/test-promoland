const timerElement = document.querySelector('[data-js-timer]')
const questionElement = document.querySelector('[data-js-quiz-question]')
const answersElement = document.querySelector('[data-js-quiz-answers]')
const nextButton = document.querySelector('[data-js-quiz-button]')
const screens = document.querySelectorAll('.screen')
const otherImg = document.querySelector('[data-js-other-img-button]')
const productImage = document.querySelector('[data-js-product-image]')
const titleElement = document.querySelector('[data-js-product-title]')
const descElement = document.querySelector('[data-js-product-desc]')
const logo = document.querySelector('[data-js-logo]')

const TIMER = 120
let remaining = TIMER
let timerInterval
const answers = []
let questionIndex = 0
let selected = null
let currentMainImageIndex = 0
window.selectedProduct = null

const consoles = {
  normal: {
    name: 'Nintendo Switch',
    desc: 'Вы предпочитаете играть дома на телевизоре и любите общие игры с друзьями. Консоль Nintendo Switch идеально подходит для семейных вечеров и встреч с друзьями. Вы получите универсальный опыт — возможность играть как на большом экране, так и взять приставку с собой в дорогу. Поддерживаются эксклюзивные игры Nintendo и широкий выбор жанров.',
    img: 'images/nintendo.png',
  },
  lite: {
    name: 'Nintendo Switch Lite',
    desc: 'Вы играете чаще вне дома или в дороге и цените компактность и мобильность. Nintendo Switch Lite — это лёгкая и удобная портативная консоль, которую легко взять с собой. Хотя она не подключается к телевизору, вы получаете доступ к большинству игр Nintendo, а небольшие размеры позволяют играть где угодно — в дороге, в парке или в гостях.',
    img: 'images/nintendo-lite.png',
  },
  two: {
    name: 'Nintendo Switch 2',
    desc: 'Вы хотите максимум мощности и передовые возможности графики, а также не прочь играть как в одиночку, так и с друзьями. Nintendo Switch 2 — новое поколение консоли с улучшенным процессором и графикой, большим экраном и поддержкой новейших игр. Это идеальный выбор для тех, кто хочет полный контроль над игровым процессом и лучшее качество развлечений.',
    img: 'images/nintendo-2.png',
  },
}

const questions = [
  {question: 'Где вы чаще играете?', answers: ['Дома на телевизоре', 'В дороге или вне дома']},
  {question: 'Что для вас важнее?', answers: ['Эксклюзивные игры', 'Мощность графики']},
  {question: 'Любите играть с друзьями?', answers: ['Да, это главное', 'Предпочитаю один']},
]

const mainImages = [
  'images/nintendo-main.png',
  'images/nintendo-main-2.png',
  'images/nintendo-main-3.png',
]

//показ экранов
const showScreen = (n) => {
  screens.forEach((screen, i) => {
    const active = i + 1 === n
    screen.classList.toggle('active', active)

    if (active) {
      const items = screen.querySelectorAll('.fade-item')
      items.forEach((el) => el.classList.remove('show'))

      items.forEach((el, idx) => setTimeout(() => el.classList.add('show'), idx * 150))
    }
  })

  if (otherImg) otherImg.disabled = n !== 1
}

//работа с таймером
const updateTimer = () => {
  const min = String(Math.floor(remaining / 60)).padStart(2, '0')
  const sec = String(remaining % 60).padStart(2, '0')

  timerElement.textContent = `${min}:${sec}`

  if (remaining <= 0) {
    clearInterval(timerInterval)
    onQuizEnd()
  }
}

const startTimer = () => {
  remaining = TIMER

  updateTimer()

  timerInterval = setInterval(() => {
    remaining--
    updateTimer()
  }, 1000)
}

//работа с квизом
const renderQuestion = () => {
  const currentQuestion = questions[questionIndex]

  questionElement.textContent = `${questionIndex + 1}. ${currentQuestion.question}`

  answersElement.innerHTML = ''

  currentQuestion.answers.forEach((option, i) => {
    const optionButton = document.createElement('button')
    optionButton.type = 'button'
    optionButton.textContent = option

    optionButton.addEventListener('click', () => {
      selected = i
      answersElement
        .querySelectorAll('button')
        .forEach((button) => button.classList.remove('active'))
      optionButton.classList.add('active')
      nextButton.disabled = false
    })

    answersElement.appendChild(optionButton)
  })

  nextButton.disabled = true
}

const onQuizEnd = () => {
  nextButton.disabled = true

  const firstAnswerQuantity = answers.filter((answer) => answer === 0).length
  const secondAnswerQuantity = answers.filter((answer) => answer === 1).length

  if (firstAnswerQuantity > secondAnswerQuantity) window.selectedProduct = consoles.normal
  else if (secondAnswerQuantity > firstAnswerQuantity) window.selectedProduct = consoles.lite
  else window.selectedProduct = consoles.two

  window.App.showScreen(2)

  setTimeout(() => {
    window.App.showScreen(3)
    window.showSelectedProduct()
  }, 6000)
}

//смена картинки при клике на кнопку в хедере
const preloadNext = () => {
  const nextIndex = (currentMainImageIndex + 1) % mainImages.length
  const img = document.createElement('img')
  img.src = mainImages[nextIndex]
}

const changeProductImage = () => {
  if (!otherImg || otherImg.disabled) return

  preloadNext()

  currentMainImageIndex = (currentMainImageIndex + 1) % mainImages.length

  productImage.classList.add('fade-out')

  setTimeout(() => {
    productImage.src = mainImages[currentMainImageIndex]
    productImage.classList.remove('fade-out')
  }, 300)
}

const resetAll = () => {
  answers.length = 0
  questionIndex = 0
  selected = null

  currentMainImageIndex = 0

  if (productImage) {
    productImage.src = mainImages[0]
  }

  clearInterval(timerInterval)
  remaining = TIMER_SECONDS
  startTimer()

  renderQuestion()

  window.App.showScreen(1)
}

//обработчики
nextButton.addEventListener('click', () => {
  answers.push(selected)
  questionIndex++
  selected = null

  if (questionIndex < questions.length) renderQuestion()
  else {
    clearInterval(timerInterval)
    onQuizEnd()
  }
})

otherImg.addEventListener('click', changeProductImage)
logo.addEventListener('click', resetAll)

document.addEventListener('DOMContentLoaded', () => {
  renderQuestion()
  startTimer()
  showScreen(1)
  if (titleElement) titleElement.textContent = 'Nintendo Switch — играй где угодно'
  if (descElement)
    descElement.textContent =
      'Гибридная игровая консоль от Nintendo: подключай к ТВ или играй в портативном режиме. Тысячи игр, легендарные эксклюзивы и полная свобода гейминга.'
})

window.App = {showScreen}