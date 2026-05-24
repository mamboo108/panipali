document.addEventListener('DOMContentLoaded', () => {
  // --- STATE ---
  let dsaFilter = 'all'; // 'all', 'incomplete'
  let dsaSearchQuery = '';
  
  let aptFilter = 'all'; // 'all', 'high', 'medium', 'incomplete'
  let aptSearchQuery = '';

  // --- DOM ELEMENTS ---
  const checkboxes = document.querySelectorAll('.topic-checkbox');
  const dsaProgressBar = document.getElementById('dsa-progress-bar');
  const dsaProgressText = document.getElementById('dsa-progress-text');
  const aptProgressBar = document.getElementById('apt-progress-bar');
  const aptProgressText = document.getElementById('apt-progress-text');
  
  // Sticky Progress Bar Elements
  const stickyProgressText = document.getElementById('sticky-progress-text');
  const stickyProgressLine = document.getElementById('sticky-progress-line');
  
  // Toast Success Notification
  const toastNotification = document.getElementById('toast-notification');
  
  // Theme Toggles
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  
  // Navigation
  const sidebar = document.getElementById('sidebar');
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('.section');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const cardHoverables = document.querySelectorAll('.card-hoverable');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');

  // Search & Filters - DSA
  const dsaSearchInput = document.getElementById('dsa-search-input');
  const dsaClearSearch = document.getElementById('dsa-clear-search');
  const dsaChips = document.querySelectorAll('#section-dsa .chip');
  const dsaItems = document.querySelectorAll('#dsa-list .topic-item');

  // Search & Filters - Aptitude
  const aptSearchInput = document.getElementById('apt-search-input');
  const aptClearSearch = document.getElementById('apt-clear-search');
  const aptChips = document.querySelectorAll('#section-aptitude .chip');
  const aptItems = document.querySelectorAll('#section-aptitude .topic-item');

  // Panic Modal Elements
  const sidebarPanicBtn = document.getElementById('sidebar-panic-btn');
  const panicModal = document.getElementById('panic-modal');
  const modalClose = document.getElementById('modal-close');
  const modalDismissBtn = document.getElementById('modal-dismiss-btn');
  const modalNextBtn = document.getElementById('modal-next-btn');
  const quoteText = document.getElementById('quote-text');

  // --- THEME TOGGLE SYSTEM ---
  function getPreferredTheme() {
    const savedTheme = localStorage.getItem('panipali_theme');
    if (savedTheme) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('panipali_theme', theme);

    themeToggleBtns.forEach(btn => {
      const iconSpan = btn.querySelector('.theme-icon');
      if (iconSpan) {
        iconSpan.textContent = theme === 'dark' ? '🌙' : '☀️';
      }
    });
  }

  // Initialize theme
  const currentTheme = getPreferredTheme();
  applyTheme(currentTheme);

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const activeTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
    });
  });

  // --- MOTIVATIONAL ADVICE QUOTES ---
  const quotes = [
    {
      text: "Don't panic! Even Strivers started with <code>Hello World</code>. Take a deep breath, close your eyes, and solve just one simple array question.",
      author: "Striver's Assistant"
    },
    {
      text: "Take a break, grab a hot tea or coffee, and start fresh. You got this!",
      author: "Beverage Break Motivation"
    },
    {
      text: "Stuck on Dynamic Programming? Don't worry, 90% of candidates in campus drives just memorize the top 10 classics anyway. Do Knapsack and LCS first!",
      author: "A Friendly Tech Lead"
    },
    {
      text: "Percentage and Work-Time questions are easy marks on IndiaBix. Solve 5 problems, read the formulas again, and watch that panic melt away.",
      author: "Aptitude Sherpa"
    },
    {
      text: "Don't think your plan failed. If you put in the effort, everything will fall into place! Keep pushing.",
      author: "Senior Developer Support"
    },
    {
      text: "Is Recursion bending your mind? Draw the call stack tree on a physical paper. It is literally the only way to visualize it.",
      author: "CS Professor"
    },
    {
      text: "Remember: Every rejection is just a redirect to a better workplace. Keep grinding and learning.",
      author: "Tech Recruiter"
    },
    {
      text: "Need a break? Walk away from the computer for 15 minutes. The brain has a 'diffuse mode' that solves problems while you are not looking.",
      author: "Learning How to Learn"
    },
    {
      text: "You don't need to be a red-rated competitive programmer. You just need to pass the screening. Speak your thoughts clearly, and write clean code.",
      author: "Interview Expert"
    },
    {
      text: "For Aptitude: Memorize fraction-to-percentage conversions (like 1/8 = 12.5%). It saves precious seconds during timed online assessments!",
      author: "Quantitative Guru"
    },
    {
      text: "Stay consistent! Solving 2 questions a day for a month is 100x better than trying to solve 60 questions the night before the placement drive.",
      author: "Placement coordinator"
    }
  ];

  // --- LOCALSTORAGE & PROGRESS LOGIC ---
  
  // Load initial checkbox states from localStorage
  function loadProgress() {
    checkboxes.forEach(cb => {
      const parentLi = cb.closest('.topic-item');
      const topicId = parentLi ? parentLi.getAttribute('data-id') : null;
      if (topicId) {
        const savedState = localStorage.getItem(`panipali_topic_${topicId}`);
        cb.checked = (savedState === 'checked');
      }
    });
    updateProgress();
  }

  // Update progress bars & text
  function updateProgress() {
    let dsaTotal = 0;
    let dsaChecked = 0;
    let aptTotal = 0;
    let aptChecked = 0;

    checkboxes.forEach(cb => {
      const section = cb.getAttribute('data-section');
      if (section === 'dsa') {
        dsaTotal++;
        if (cb.checked) dsaChecked++;
      } else if (section === 'apt') {
        aptTotal++;
        if (cb.checked) aptChecked++;
      }
    });

    const dsaPercent = dsaTotal > 0 ? (dsaChecked / dsaTotal) * 100 : 0;
    const aptPercent = aptTotal > 0 ? (aptChecked / aptTotal) * 100 : 0;

    // Update DSA Progress Bar
    if (dsaProgressBar && dsaProgressText) {
      dsaProgressBar.style.width = `${dsaPercent}%`;
      dsaProgressText.textContent = `${dsaChecked} / ${dsaTotal}`;
    }

    // Update Aptitude Progress Bar
    if (aptProgressBar && aptProgressText) {
      aptProgressBar.style.width = `${aptPercent}%`;
      aptProgressText.textContent = `${aptChecked} / ${aptTotal}`;
    }

    // Update Sticky Progress Bar
    const totalTopics = dsaTotal + aptTotal; // 27
    const totalChecked = dsaChecked + aptChecked;
    const totalPercent = totalTopics > 0 ? (totalChecked / totalTopics) * 100 : 0;

    if (stickyProgressText) {
      stickyProgressText.textContent = `${totalChecked} / ${totalTopics} topics done — ${Math.round(totalPercent)}%`;
    }
    if (stickyProgressLine) {
      stickyProgressLine.style.width = `${totalPercent}%`;
    }
  }

  // --- TOAST SUCCESS NOTIFICATION ---
  let toastTimeout;
  function showSavedToast() {
    if (toastNotification) {
      toastNotification.classList.add('show');
      clearTimeout(toastTimeout);
      toastTimeout = setTimeout(() => {
        toastNotification.classList.remove('show');
      }, 1500);
    }
  }

  // Save specific checkbox state to localStorage on change
  checkboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      const parentLi = cb.closest('.topic-item');
      const topicId = parentLi ? parentLi.getAttribute('data-id') : null;
      if (topicId) {
        localStorage.setItem(`panipali_topic_${topicId}`, cb.checked ? 'checked' : 'unchecked');
      }
      updateProgress();
      showSavedToast();
      
      // If incomplete filter is active, re-run filtering to hide the checked item
      const section = cb.getAttribute('data-section');
      if (section === 'dsa' && dsaFilter === 'incomplete') {
        applyDsaFilters();
      } else if (section === 'apt' && aptFilter === 'incomplete') {
        applyAptFilters();
      }
    });
  });

  // --- SECTION NAVIGATION CONTROLLER ---

  function switchSection(targetId) {
    // Hide all sections
    sections.forEach(section => section.classList.remove('active'));
    // Show target section
    const targetSection = document.getElementById(`section-${targetId}`);
    if (targetSection) {
      targetSection.classList.add('active');
    }

    // Update sidebar navigation links focus
    navItems.forEach(item => {
      if (item.getAttribute('data-target') === targetId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Reset window scroll
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Close mobile menu if open
    closeSidebar();
  }

  // Bind click event to navigation links
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const targetId = item.getAttribute('data-target');
      if (targetId) {
        switchSection(targetId);
      }
    });
  });

  // Overview dashboard cards triggers
  cardHoverables.forEach(card => {
    card.addEventListener('click', () => {
      const target = card.getAttribute('data-target');
      if (target) {
        switchSection(target);
      }
    });
  });

  // --- MOBILE BURGER TOGGLE ---
  function openSidebar() {
    sidebar.classList.add('active');
    mobileMenuBtn.classList.add('active');
    if (sidebarBackdrop) sidebarBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    sidebar.classList.remove('active');
    mobileMenuBtn.classList.remove('active');
    if (sidebarBackdrop) sidebarBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  mobileMenuBtn.addEventListener('click', () => {
    if (sidebar.classList.contains('active')) {
      closeSidebar();
    } else {
      openSidebar();
    }
  });

  // Close sidebar on backdrop click
  if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener('click', closeSidebar);
  }

  // Close sidebar on nav item click (for mobile viewport size)
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        closeSidebar();
      }
    });
  });

  // Close sidebar on clicks outside (as a fallback)
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
      if (!sidebar.contains(e.target) && !mobileMenuBtn.contains(e.target) && sidebar.classList.contains('active') && !e.target.classList.contains('theme-toggle-btn') && !e.target.closest('.theme-toggle-btn')) {
        closeSidebar();
      }
    }
  });

  // --- DSA SEARCH & FILTERS ---

  function applyDsaFilters() {
    const query = dsaSearchQuery.toLowerCase().trim();

    dsaItems.forEach(item => {
      const topicName = item.querySelector('.topic-name').textContent.toLowerCase();
      const topicDescEl = item.querySelector('.topic-desc');
      const topicDesc = topicDescEl ? topicDescEl.textContent.toLowerCase() : '';
      const isChecked = item.querySelector('.topic-checkbox').checked;

      const matchesSearch = topicName.includes(query) || topicDesc.includes(query);
      const matchesChip = (dsaFilter === 'all') || (dsaFilter === 'incomplete' && !isChecked);

      if (matchesSearch && matchesChip) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
  }

  // DSA Search Input
  dsaSearchInput.addEventListener('input', (e) => {
    dsaSearchQuery = e.target.value;
    dsaClearSearch.style.display = dsaSearchQuery.length > 0 ? 'flex' : 'none';
    applyDsaFilters();
  });

  // DSA Clear Search
  dsaClearSearch.addEventListener('click', () => {
    dsaSearchInput.value = '';
    dsaSearchQuery = '';
    dsaClearSearch.style.display = 'none';
    dsaSearchInput.focus();
    applyDsaFilters();
  });

  // DSA Chips
  dsaChips.forEach(chip => {
    chip.addEventListener('click', () => {
      dsaChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      dsaFilter = chip.getAttribute('data-filter');
      applyDsaFilters();
    });
  });

  // --- APTITUDE SEARCH & FILTERS ---

  function applyAptFilters() {
    const query = aptSearchQuery.toLowerCase().trim();

    aptItems.forEach(item => {
      const topicName = item.querySelector('.topic-name').textContent.toLowerCase();
      const priority = item.getAttribute('data-priority');
      const isChecked = item.querySelector('.topic-checkbox').checked;

      const matchesSearch = topicName.includes(query);
      
      let matchesChip = false;
      if (aptFilter === 'all') {
        matchesChip = true;
      } else if (aptFilter === 'high' && priority === 'high') {
        matchesChip = true;
      } else if (aptFilter === 'medium' && priority === 'medium') {
        matchesChip = true;
      } else if (aptFilter === 'incomplete' && !isChecked) {
        matchesChip = true;
      }

      if (matchesSearch && matchesChip) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
  }

  // Aptitude Search Input
  aptSearchInput.addEventListener('input', (e) => {
    aptSearchQuery = e.target.value;
    aptClearSearch.style.display = aptSearchQuery.length > 0 ? 'flex' : 'none';
    applyAptFilters();
  });

  // Aptitude Clear Search
  aptClearSearch.addEventListener('click', () => {
    aptSearchInput.value = '';
    aptSearchQuery = '';
    aptClearSearch.style.display = 'none';
    aptSearchInput.focus();
    applyAptFilters();
  });

  // Aptitude Chips
  aptChips.forEach(chip => {
    chip.addEventListener('click', () => {
      aptChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      aptFilter = chip.getAttribute('data-filter');
      applyAptFilters();
    });
  });

  // --- PANIC / DISTRESS SUPPORT MODAL ---

  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const selectedQuote = quotes[randomIndex];
    quoteText.innerHTML = selectedQuote.text;
    quoteText.setAttribute('data-index', randomIndex);
  }

  function openModal() {
    showRandomQuote();
    panicModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Disable scroll on background
  }

  function closeModal() {
    panicModal.classList.remove('active');
    document.body.style.overflow = ''; // Re-enable scroll
  }

  // Sidebar distress trigger
  sidebarPanicBtn.addEventListener('click', openModal);

  // Close triggers
  modalClose.addEventListener('click', closeModal);
  modalDismissBtn.addEventListener('click', closeModal);
  panicModal.addEventListener('click', (e) => {
    if (e.target === panicModal) {
      closeModal();
    }
  });

  // Cycle quote inside modal
  modalNextBtn.addEventListener('click', () => {
    const currentIndex = parseInt(quoteText.getAttribute('data-index') || '-1', 10);
    let newIndex = currentIndex;
    
    if (quotes.length > 1) {
      while (newIndex === currentIndex) {
        newIndex = Math.floor(Math.random() * quotes.length);
      }
    }
    
    const selectedQuote = quotes[newIndex];
    quoteText.innerHTML = selectedQuote.text;
    quoteText.setAttribute('data-index', newIndex);
  });

  // ESC key listener to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panicModal.classList.contains('active')) {
      closeModal();
    }
  });

  // --- INITIALIZATION ---
  loadProgress();
});
