document.addEventListener('DOMContentLoaded', () => {
    // Debug flag for logging
    const DEBUG = true;
  
    // Initialize progress from localStorage or default to 0
    const subjects = ['physics', 'english', 'maths'];
    const totalLessons = {
      physics: 66,
      english: 30,
      maths: 15
    };
  
    // Log initialization
    if (DEBUG) console.log('Initializing page...');
  
    // Hide all sub-lessons and videos initially
    document.querySelectorAll('.sub-lessons').forEach(subLessons => {
      subLessons.classList.add('hidden');
    });
    document.querySelectorAll('.video-link video').forEach(video => {
      video.classList.add('hidden');
    });
  
    // Load progress for each subject
    subjects.forEach(subject => {
      const progress = localStorage.getItem(`${subject}-progress`) || 0;
      updateProgress(subject, parseInt(progress));
      if (DEBUG) console.log(`Loaded ${subject} progress: ${progress}`);
    });
  
    // Event delegation for chapter headers
    document.addEventListener('click', (e) => {
      const header = e.target.closest('.chapter-header');
      if (header) {
        const chapter = header.parentElement;
        const subLessons = chapter.querySelector('.sub-lessons');
        const toggleIcon = header.querySelector('.toggle-icon');
  
        if (!subLessons || !toggleIcon) {
          if (DEBUG) console.error('Sub-lessons or toggle-icon not found for chapter:', chapter);
          return;
        }
  
        subLessons.classList.toggle('hidden');
        toggleIcon.textContent = subLessons.classList.contains('hidden') ? '▶' : '▼';
        if (DEBUG) console.log(`Toggled sub-lessons for chapter: ${header.textContent}`);
      }
    });
  
    // Event delegation for lesson titles
    document.addEventListener('click', (e) => {
      const lessonTitle = e.target.closest('.lesson-title');
      if (lessonTitle) {
        const videoLink = lessonTitle.closest('.video-link');
        const video = videoLink.querySelector('video');
  
        if (!video) {
          if (DEBUG) console.error('Video not found for lesson:', lessonTitle.textContent);
          return;
        }
  
        video.classList.toggle('hidden');
        if (DEBUG) console.log(`Toggled video for lesson: ${lessonTitle.textContent}`);
      }
    });
  
    // Handle progress checkbox updates
    document.addEventListener('change', (e) => {
      const checkbox = e.target.closest('.progress-checkbox');
      if (checkbox) {
        const subject = checkbox.dataset.video.split('-')[0];
        updateProgress(subject, calculateProgress(subject));
        
        // Special handling for Physics
        if (subject === 'physics') {
          animatePhysicsProgress();
        }
        if (DEBUG) console.log(`Updated progress for ${subject}: ${checkbox.checked ? 'checked' : 'unchecked'}`);
      }
    });
  
    // Handle quiz button clicks
    document.addEventListener('click', (e) => {
      const button = e.target.closest('.quiz-btn');
      if (button) {
        const lessonId = button.dataset.lesson;
        showQuizModal(lessonId);
        if (DEBUG) console.log(`Opened quiz modal for lesson: ${lessonId}`);
      }
    });
  
    // Search functionality
    const searchBar = document.querySelector('#searchBar');
    const searchType = document.querySelector('#searchType');
    if (searchBar && searchType) {
      searchBar.addEventListener('input', () => {
        const query = searchBar.value.toLowerCase();
        const type = searchType.value;
        filterContent(query, type);
        if (DEBUG) console.log(`Search query: ${query}, type: ${type}`);
      });
    } else {
      if (DEBUG) console.error('Search bar or search type not found');
    }
  
    // Calculate progress for a subject
    function calculateProgress(subject) {
      const checkboxes = document.querySelectorAll(`.progress-checkbox[data-video^="${subject}-"]`);
      const checked = Array.from(checkboxes).filter(cb => cb.checked).length;
      localStorage.setItem(`${subject}-progress`, checked);
      return checked;
    }
  
    // Update progress bar and text
    function updateProgress(subject, completed) {
      const progressBar = document.querySelector(`#${subject}-progress-bar`);
      const progressText = document.querySelector(`#${subject}-progress-text`);
      if (progressBar && progressText) {
        progressBar.value = completed;
        progressText.textContent = `${completed}/${totalLessons[subject]} lessons completed`;
      } else {
        if (DEBUG) console.error(`Progress elements not found for ${subject}`);
      }
    }
  
    // Animate Physics progress bar
    function animatePhysicsProgress() {
      const progressBar = document.querySelector('#physics-progress-bar');
      if (progressBar) {
        progressBar.classList.add('animate-pulse');
        setTimeout(() => progressBar.classList.remove('animate-pulse'), 1000);
        
        // Confetti effect for Physics completion
        const completed = calculateProgress('physics');
        if (completed === totalLessons.physics) {
          triggerConfetti();
        }
      } else {
        if (DEBUG) console.error('Physics progress bar not found');
      }
    }
  
    // Show quiz modal
    function showQuizModal(lessonId) {
      const modal = document.createElement('div');
      modal.className = 'quiz-modal';
      modal.innerHTML = `
        <div class="quiz-modal-content">
          <h3 class="text-xl font-bold mb-4">Quiz for ${lessonId}</h3>
          <p>Test your knowledge on this lesson!</p>
          <div class="mt-4">
            <button class="start-quiz-btn">Start Quiz</button>
            <button class="close-modal">Close</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
      
      modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
        if (DEBUG) console.log('Closed quiz modal');
      });
    }
  
    // Filter lessons or units based on search
    function filterContent(query, type) {
      const chapters = document.querySelectorAll('.chapter');
      chapters.forEach(chapter => {
        const lessons = chapter.querySelectorAll('.video-link');
        let hasMatch = false;
  
        if (type === 'units') {
          const chapterTitle = chapter.querySelector('.chapter-header span')?.textContent.toLowerCase();
          hasMatch = chapterTitle?.includes(query) || false;
        } else {
          lessons.forEach(lesson => {
            const lessonTitle = lesson.querySelector('.lesson-title')?.textContent.toLowerCase();
            const isVisible = lessonTitle?.includes(query) || false;
            lesson.style.display = isVisible ? 'flex' : 'none';
            if (isVisible) hasMatch = true;
          });
        }
  
        chapter.style.display = hasMatch ? 'block' : 'none';
      });
    }
  
    // Confetti effect for Physics completion
    function triggerConfetti() {
      const canvas = document.createElement('canvas');
      canvas.className = 'fixed inset-0 pointer-events-none z-50';
      document.body.appendChild(canvas);
      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
  
      const particles = [];
      for (let i = 0; i < 100; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 10 + 5,
          speedX: Math.random() * 6 - 3,
          speedY: Math.random() * 6 - 3,
          color: `hsl(${Math.random() * 360}, 70%, 50%)`
        });
      }
  
      function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          p.x += p.speedX;
          p.y += p.speedY;
          p.size *= 0.95;
        });
        if (particles.some(p => p.size > 1)) {
          requestAnimationFrame(animate);
        } else {
          canvas.remove();
        }
      }
      animate();
      if (DEBUG) console.log('Triggered confetti effect');
    }
  });