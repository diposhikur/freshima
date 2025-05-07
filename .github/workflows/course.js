document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const chapters = document.querySelectorAll('.chapter');
  const searchBar = document.getElementById('searchBar');
  const searchType = document.getElementById('searchType');
  const progressText = document.getElementById('progress-text');
  const progressBar = document.getElementById('progress-bar');
  const videoLinks = document.querySelectorAll('.video-link');
  const progressCheckboxes = document.querySelectorAll('.progress-checkbox');
  const quizForm = document.getElementById('quiz-form');
  const quizModal = document.getElementById('quiz-modal');
  const quizCloseButton = document.querySelector('.quiz-close');

  // Initialize progress and video states from localStorage
  let completedLessons = JSON.parse(localStorage.getItem('completedLessons')) || [];
  let videoProgress = JSON.parse(localStorage.getItem('videoProgress')) || {};
  let quizResults = JSON.parse(localStorage.getItem('quizResults')) || {};
  const totalLessons = progressCheckboxes.length || 66;

  // Sample quiz data (replace with API or dynamic source)
  const quizzes = [
    {
      id: 1,
      title: "Physics Basics",
      question: "What is the unit of force?",
      options: ["Newton", "Joule", "Watt", "Pascal"],
      correctAnswer: 1
    },
    {
      id: 2,
      title: "Motion",
      question: "What is the formula for velocity?",
      options: ["v = d/t", "v = m/a", "v = F/m", "v = P/t"],
      correctAnswer: 1
    }
  ];

  // Function to update progress
  function updateProgress() {
    completedLessons = Array.from(progressCheckboxes)
      .filter(checkbox => checkbox.checked)
      .map(checkbox => checkbox.dataset.video);

    localStorage.setItem('completedLessons', JSON.stringify(completedLessons));

    // Update progress text
    if (progressText) {
      progressText.textContent = `${completedLessons.length}/${totalLessons} lessons completed`;
    } else {
      console.error('Progress text element not found');
    }

    // Update progress bar
    if (progressBar) {
      progressBar.setAttribute('value', completedLessons.length);
      progressBar.setAttribute('max', totalLessons);
      progressBar.classList.remove('animate-progress');
      void progressBar.offsetWidth; // Force reflow
      progressBar.classList.add('animate-progress');
    } else {
      console.error('Progress bar element not found');
    }

    // Update video link styles
    videoLinks.forEach(link => {
      const videoId = link.dataset.lessonId;
      if (completedLessons.includes(videoId)) {
        link.classList.add('completed');
      } else {
        link.classList.remove('completed');
      }
    });

    // Save progress to localStorage
    localStorage.setItem('lessonProgress', JSON.stringify({
      completed: completedLessons.length,
      total: totalLessons
    }));
  }

  // Function to show the quiz modal
  function showQuiz(quizId) {
    const quiz = quizzes.find(q => q.id === parseInt(quizId));
    if (!quiz) {
      console.error('Quiz not found for ID:', quizId);
      return;
    }

    // Populate quiz content
    document.getElementById('quiz-title').textContent = quiz.title;
    document.getElementById('question-text').textContent = quiz.question;
    document.getElementById('option1').textContent = quiz.options[0];
    document.getElementById('option2').textContent = quiz.options[1];
    document.getElementById('option3').textContent = quiz.options[2];
    document.getElementById('option4').textContent = quiz.options[3];

    // Reset form
    quizForm.reset();
    const quizContent = document.querySelector('.quiz-content');
    quizContent.classList.remove('correct', 'wrong');

    // Show modal
    quizModal.classList.add('active');

    // Store current quiz ID
    quizForm.dataset.quizId = quizId;
  }

  // Function to handle quiz submission
  function handleQuizSubmit(event) {
    event.preventDefault();
    const quizId = parseInt(quizForm.dataset.quizId);
    const quiz = quizzes.find(q => q.id === quizId);
    const selectedAnswer = quizForm.querySelector('input[name="answer"]:checked');

    if (!selectedAnswer) {
      alert('Please select an answer.');
      return;
    }

    const userAnswer = parseInt(selectedAnswer.value);
    const quizContent = document.querySelector('.quiz-content');

    // Check answer and provide feedback
    if (userAnswer === quiz.correctAnswer) {
      quizContent.classList.add('correct');
      quizContent.classList.remove('wrong');
      alert('Correct! Well done!');
    } else {
      quizContent.classList.add('wrong');
      quizContent.classList.remove('correct');
      alert(`Incorrect. The correct answer is: ${quiz.options[quiz.correctAnswer - 1]}`);
    }

    // Save result to localStorage
    quizResults[quizId] = {
      answered: true,
      correct: userAnswer === quiz.correctAnswer
    };
    localStorage.setItem('quizResults', JSON.stringify(quizResults));
  }

  // Function to close the quiz modal
  function closeQuizModal() {
    quizModal.classList.remove('active');
  }

  // Toggle chapter expansion/collapse
  chapters.forEach(chapter => {
    const header = chapter.querySelector('.chapter-header');
    const subLessons = chapter.querySelector('.sub-lessons');

    // Set initial state from localStorage
    const isExpanded = localStorage.getItem(`chapter-${chapter.dataset.chapterId}`) === 'expanded';
    if (isExpanded) {
      chapter.classList.add('active');
      setTimeout(() => {
        subLessons.style.maxHeight = subLessons.scrollHeight + 'px';
      }, 0);
    }

    header.addEventListener('click', () => {
      chapter.classList.toggle('active');
      if (chapter.classList.contains('active')) {
        setTimeout(() => {
          subLessons.style.maxHeight = subLessons.scrollHeight + 'px';
          localStorage.setItem(`chapter-${chapter.dataset.chapterId}`, 'expanded');
        }, 0);
      } else {
        subLessons.style.maxHeight = '0';
        localStorage.setItem(`chapter-${chapter.dataset.chapterId}`, 'collapsed');
      }

      // Close videos in other chapters
      chapters.forEach(otherChapter => {
        if (otherChapter !== chapter) {
          otherChapter.querySelectorAll('.video-link').forEach(link => {
            link.classList.remove('active');
            const video = link.querySelector('video');
            video.style.display = 'none';
            video.pause();
          });
        }
      });
    });
  });

  // Toggle video display with advanced features
  videoLinks.forEach(link => {
    const title = link.querySelector('.lesson-title');
    const video = link.querySelector('video');
    const videoId = link.dataset.lessonId;
    const quizButton = link.querySelector('.quiz-btn');

    // Restore video progress
    if (videoProgress[videoId]) {
      video.currentTime = videoProgress[videoId];
    }

    title.addEventListener('click', (e) => {
      if (e.target !== title) return;

      // Close all other videos
      videoLinks.forEach(otherLink => {
        if (otherLink !== link) {
          otherLink.classList.remove('active');
          const otherVideo = otherLink.querySelector('video');
          otherVideo.style.display = 'none';
          otherVideo.pause();
        }
      });

      // Toggle current video
      link.classList.toggle('active');
      if (link.classList.contains('active')) {
        video.style.display = 'block';
        video.play().catch(error => console.log('Autoplay prevented:', error));
        video.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        video.style.display = 'none';
        video.pause();
      }
    });

    // Save video progress on time update
    video.addEventListener('timeupdate', () => {
      videoProgress[videoId] = video.currentTime;
      localStorage.setItem('videoProgress', JSON.stringify(videoProgress));

      // Mark as completed if watched more than 90%
      if (video.currentTime / video.duration > 0.9) {
        const checkbox = link.querySelector('.progress-checkbox');
        if (!checkbox.checked) {
          checkbox.checked = true;
          updateProgress();
        }
      }
    });

    // Reset progress when video ends
    video.addEventListener('ended', () => {
      video.currentTime = 0;
      videoProgress[videoId] = 0;
      localStorage.setItem('videoProgress', JSON.stringify(videoProgress));
    });

    // Add quiz button event listener
    if (quizButton) {
      quizButton.addEventListener('click', () => {
        const lessonId = quizButton.dataset.lesson;
        const quizId = lessonId === 'video1' ? 1 : 2; // Adjust mapping as needed
        showQuiz(quizId);
      });
    }
  });

  // Handle progress checkbox changes
  progressCheckboxes.forEach(checkbox => {
    if (completedLessons.includes(checkbox.dataset.video)) {
      checkbox.checked = true;
    }
    checkbox.addEventListener('change', updateProgress);
  });

  // Enhanced search functionality
  function searchLessons() {
    const searchTerm = searchBar.value.toLowerCase();
    const searchBy = searchType.value;
    let hasResults = false;

    if (searchTerm.length < 2) {
      chapters.forEach(chapter => {
        chapter.style.display = 'block';
        chapter.classList.remove('active');
        chapter.querySelector('.sub-lessons').style.maxHeight = '0';
        localStorage.setItem(`chapter-${chapter.dataset.chapterId}`, 'collapsed');

        chapter.querySelectorAll('.video-link').forEach(link => {
          link.style.display = 'flex';
          link.classList.remove('active');
          link.querySelector('video').style.display = 'none';
          link.querySelector('.lesson-title').innerHTML = link.querySelector('.lesson-title').textContent;
        });
      });
      return;
    }

    chapters.forEach(chapter => {
      const chapterTitle = chapter.querySelector('.chapter-header span').textContent.toLowerCase();
      const videoLinks = chapter.querySelectorAll('.video-link');
      let chapterHasResults = false;

      videoLinks.forEach(link => {
        const lessonTitle = link.querySelector('.lesson-title').textContent.toLowerCase();
        const displayText = link.querySelector('.lesson-title').textContent;

        if (searchBy === 'lessons' && lessonTitle.includes(searchTerm)) {
          const regex = new RegExp(searchTerm, 'gi');
          const highlightedText = displayText.replace(regex, match => `<span class="highlight">${match}</span>`);
          link.querySelector('.lesson-title').innerHTML = highlightedText;
          link.style.display = 'flex';
          chapterHasResults = true;
          hasResults = true;
        } else if (searchBy === 'units' && chapterTitle.includes(searchTerm)) {
          chapterHasResults = true;
          hasResults = true;
          link.style.display = 'flex';
          link.querySelector('.lesson-title').innerHTML = displayText;
        } else {
          link.style.display = 'none';
          link.classList.remove('active');
          link.querySelector('video').style.display = 'none';
          link.querySelector('.lesson-title').innerHTML = displayText;
        }
      });

      chapter.style.display = chapterHasResults ? 'block' : 'none';
      if (chapterHasResults) {
        chapter.classList.add('active');
        const subLessons = chapter.querySelector('.sub-lessons');
        setTimeout(() => {
          subLessons.style.maxHeight = subLessons.scrollHeight + 'px';
          localStorage.setItem(`chapter-${chapter.dataset.chapterId}`, 'expanded');
        }, 0);
      }
    });

    if (!hasResults) {
      console.log('No results found');
    }
  }

  // Event listeners for search
  searchBar.addEventListener('input', searchLessons);
  searchType.addEventListener('change', searchLessons);

  // Quiz event listeners
  if (quizForm) {
    quizForm.addEventListener('submit', handleQuizSubmit);
  } else {
    console.error('Quiz form not found');
  }

  if (quizCloseButton) {
    quizCloseButton.addEventListener('click', closeQuizModal);
  } else {
    console.error('Close button not found');
  }

  if (quizModal) {
    quizModal.addEventListener('click', (e) => {
      if (e.target === quizModal) {
        closeQuizModal();
      }
    });
  }

  // Keyboard shortcuts
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const activeVideo = document.querySelector('.video-link.active');
      if (activeVideo) {
        activeVideo.classList.remove('active');
        activeVideo.querySelector('video').style.display = 'none';
        activeVideo.querySelector('video').pause();
      }
      closeQuizModal();
    }

    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
      e.preventDefault();
      searchBar.focus();
    }
  });

  // Initialize progress
  const savedProgress = JSON.parse(localStorage.getItem('lessonProgress'));
  if (savedProgress) {
    progressCheckboxes.forEach((cb, index) => {
      cb.checked = index < savedProgress.completed;
    });
  }
  updateProgress();
});