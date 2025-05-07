document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const chapters = document.querySelectorAll('.chapter');
    const searchBar = document.getElementById('searchBar');
    const searchType = document.getElementById('searchType');
    const progressDisplay = document.getElementById('progress');
    const videoLinks = document.querySelectorAll('.video-link');
    const progressCheckboxes = document.querySelectorAll('.progress-checkbox');
  
    // Initialize progress and video states from localStorage
    let completedLessons = JSON.parse(localStorage.getItem('completedLessons')) || [];
    let videoProgress = JSON.parse(localStorage.getItem('videoProgress')) || {};
    let totalLessons = videoLinks.length;
  
    // Update progress display
    function updateProgress() {
      completedLessons = Array.from(progressCheckboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.dataset.video);
  
      localStorage.setItem('completedLessons', JSON.stringify(completedLessons));
      progressDisplay.textContent = `Progress: ${completedLessons.length}/${totalLessons} lessons completed`;
  
      videoLinks.forEach(link => {
        const videoId = link.dataset.lessonId;
        if (completedLessons.includes(videoId)) {
          link.classList.add('completed');
        } else {
          link.classList.remove('completed');
        }
      });
    }
  
    // Toggle chapter expansion/collapse
    chapters.forEach(chapter => {
      const header = chapter.querySelector('.chapter-header');
      const subLessons = chapter.querySelector('.sub-lessons');
  
      // Set initial state from localStorage
      const isExpanded = localStorage.getItem(`chapter-${chapter.dataset.chapterId}`) === 'expanded';
      if (isExpanded) {
        chapter.classList.add('active');
        subLessons.style.maxHeight = subLessons.scrollHeight + 'px';
      }
  
      header.addEventListener('click', () => {
        // Toggle current chapter
        chapter.classList.toggle('active');
  
        if (chapter.classList.contains('active')) {
          subLessons.style.maxHeight = subLessons.scrollHeight + 'px';
          localStorage.setItem(`chapter-${chapter.dataset.chapterId}`, 'expanded');
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
          video.play().catch(error => {
            console.log('Autoplay prevented:', error);
          });
          // Scroll to the video
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
  
      // Reset display if search term is too short
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
            // Highlight matching text
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
  
        // Show/hide chapter based on results
        chapter.style.display = chapterHasResults ? 'block' : 'none';
        if (chapterHasResults) {
          chapter.classList.add('active');
          chapter.querySelector('.sub-lessons').style.maxHeight = chapter.querySelector('.sub-lessons').scrollHeight + 'px';
          localStorage.setItem(`chapter-${chapter.dataset.chapterId}`, 'expanded');
        }
      });
  
      // If no results, show a message (optional, can be styled via CSS)
      if (!hasResults) {
        console.log('No results found');
      }
    }
  
    // Event listeners for search
    searchBar.addEventListener('input', searchLessons);
    searchType.addEventListener('change', searchLessons);
  
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
      // Close video with Escape key
      if (e.key === 'Escape') {
        const activeVideo = document.querySelector('.video-link.active');
        if (activeVideo) {
          activeVideo.classList.remove('active');
          activeVideo.querySelector('video').style.display = 'none';
          activeVideo.querySelector('video').pause();
        }
      }
  
      // Focus search bar with Ctrl/Cmd + F
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        searchBar.focus();
      }
    });
  
    // Initialize progress
    updateProgress();
  });



  document.querySelectorAll('.unit-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        card.style.setProperty('--rotation-x', `${(y - centerY) / 20}deg`);
        card.style.setProperty('--rotation-y', `${(centerX - x) / 20}deg`);
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.setProperty('--rotation-x', '0deg');
        card.style.setProperty('--rotation-y', '0deg');
    });
});