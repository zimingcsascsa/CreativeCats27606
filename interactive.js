// Advanced Interactivity for Creative Cats Website

// ============================================================
// 1. SCHOOL AFFILIATION HIGHLIGHT & FILTER
// ============================================================
(function() {
  const schoolData = {
    'Tanvi': 'LASA',
    'Aish': 'Westlake',
    'Ziming': 'LASA',
    'Isaac': 'Westlake',
    'Oye': 'Austin High',
    'Greeshmi': 'Bowie',
    'Naveen': 'Mentor',
    'Carsten': 'Canyon Ridge',
    'Riya': 'Austin High',
    'Fnan': 'Westlake',
    'Raveena': 'LASA',
    'Simpal': 'Bowie',
    'Michelle': 'Canyon Ridge',
    'Lohitha': 'Austin High'
  };

  window.schoolAffiliations = schoolData;

  // Add school badges to member cards dynamically
  function enhanceMemberCards() {
    document.querySelectorAll('.member-card').forEach(card => {
      const nameEl = card.querySelector('.member-name');
      if (nameEl) {
        const name = nameEl.textContent.trim();
        const school = schoolData[name];
        if (school) {
          const badge = document.createElement('div');
          badge.className = 'school-badge';
          badge.textContent = school;
          badge.setAttribute('data-school', school);
          nameEl.parentNode.insertBefore(badge, nameEl.nextSibling);
        }
      }
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enhanceMemberCards);
  } else {
    enhanceMemberCards();
  }
})();

// ============================================================
// 2. DYNAMIC SCHOOL FILTER (for team page)
// ============================================================
(function() {
  const createSchoolFilter = () => {
    const teamSection = document.querySelector('section');
    if (!teamSection || !teamSection.querySelector('.member-grid')) return;

    const schools = ['All', 'LASA', 'Westlake', 'Austin High', 'Bowie', 'Canyon Ridge', 'Mentor'];
    const filterContainer = document.createElement('div');
    filterContainer.className = 'school-filter reveal';
    filterContainer.innerHTML = '<p style="margin-bottom: 1rem; color: #aaa;">Filter by school:</p>';

    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'filter-buttons';

    schools.forEach(school => {
      const btn = document.createElement('button');
      btn.className = 'filter-btn' + (school === 'All' ? ' active' : '');
      btn.textContent = school;
      btn.onclick = () => filterMembers(school, schools);
      buttonGroup.appendChild(btn);
    });

    filterContainer.appendChild(buttonGroup);
    const sectionHeader = teamSection.querySelector('.section-header');
    if (sectionHeader && sectionHeader.nextElementSibling) {
      sectionHeader.parentNode.insertBefore(filterContainer, sectionHeader.nextElementSibling);
    }
  };

  const filterMembers = (schoolFilter, schools) => {
    // Update button states
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.toggle('active', btn.textContent === schoolFilter);
    });

    // Filter members
    document.querySelectorAll('.member-card').forEach(card => {
      const badge = card.querySelector('.school-badge');
      if (schoolFilter === 'All' || !badge) {
        card.style.display = 'grid';
        card.style.animation = 'fadeInUp 0.3s ease-out';
      } else {
        const cardSchool = badge.getAttribute('data-school');
        card.style.display = cardSchool === schoolFilter ? 'grid' : 'none';
        if (cardSchool === schoolFilter) {
          card.style.animation = 'fadeInUp 0.3s ease-out';
        }
      }
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createSchoolFilter);
  } else {
    createSchoolFilter();
  }
})();

// ============================================================
// 3. ENHANCED STAT COUNTERS WITH FORMATTING
// ============================================================
(function() {
  function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  window.animateCounter = function(el, duration = 1800) {
    const target = parseInt(el.dataset.target, 10);
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      el.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target;
      }
    };

    requestAnimationFrame(tick);
  };
})();

// ============================================================
// 4. SMOOTH IMAGE MODAL VIEWER
// ============================================================
(function() {
  function initImageModal() {
    // Add modal HTML
    if (!document.getElementById('imageModal')) {
      const modal = document.createElement('div');
      modal.id = 'imageModal';
      modal.className = 'image-modal';
      modal.innerHTML = `
        <div class="modal-content">
          <span class="modal-close">&times;</span>
          <img id="modalImage" src="" alt="">
          <div class="modal-nav">
            <button class="modal-prev">&larr;</button>
            <button class="modal-next">&rarr;</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    const modal = document.getElementById('imageModal');
    let currentIndex = 0;
    let images = [];

    // Make gallery images clickable
    document.addEventListener('click', (e) => {
      if (e.target.tagName === 'IMG' && (e.target.closest('.robot-gallery') || e.target.closest('.media-gallery'))) {
        images = Array.from(document.querySelectorAll('.robot-gallery img, .media-gallery img'));
        currentIndex = images.indexOf(e.target);
        showModal(e.target.src);
      }
    });

    function showModal(src) {
      const img = document.getElementById('modalImage');
      img.src = src;
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }

    document.querySelector('.modal-close').onclick = closeModal;
    modal.onclick = (e) => {
      if (e.target === modal) closeModal();
    };

    document.querySelector('.modal-prev').onclick = () => {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      showModal(images[currentIndex].src);
    };

    document.querySelector('.modal-next').onclick = () => {
      currentIndex = (currentIndex + 1) % images.length;
      showModal(images[currentIndex].src);
    };

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('open')) return;
      if (e.key === 'ArrowLeft') document.querySelector('.modal-prev').click();
      if (e.key === 'ArrowRight') document.querySelector('.modal-next').click();
      if (e.key === 'Escape') closeModal();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initImageModal);
  } else {
    initImageModal();
  }
})();

// ============================================================
// 5. SCROLL-TO-TOP BUTTON WITH SMART VISIBILITY
// ============================================================
(function() {
  const createScrollButton = () => {
    if (document.getElementById('scrollTopBtn')) return;

    const btn = document.createElement('button');
    btn.id = 'scrollTopBtn';
    btn.className = 'scroll-top-btn';
    btn.innerHTML = '↑';
    btn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createScrollButton);
  } else {
    createScrollButton();
  }
})();

// ============================================================
// 6. INTERACTIVE STAT CARDS WITH HOVER EFFECT
// ============================================================
(function() {
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.stat-item').forEach(item => {
      item.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
      });
      item.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
      });
    });
  });
})();

// ============================================================
// 7. NAVBAR SCROLL EFFECT (hide on scroll down, show on scroll up)
// ============================================================
(function() {
  const header = document.querySelector('header');
  if (!header) return;

  let lastScrollTop = 0;
  let scrollTimeout;

  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    const scrollTop = window.scrollY;

    if (scrollTop > lastScrollTop) {
      // Scrolling down
      header.classList.add('scroll-hidden');
    } else {
      // Scrolling up
      header.classList.remove('scroll-hidden');
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;

    // Reset if user stops scrolling
    scrollTimeout = setTimeout(() => {
      header.classList.remove('scroll-hidden');
    }, 1500);
  });
})();

// ============================================================
// 8. DYNAMIC RECRUITMENT MESSAGE
// ============================================================
(function() {
  const addRecruitmentHighlight = () => {
    // Find sections mentioning recruitment/team
    const sections = document.querySelectorAll('section');
    let added = false;

    sections.forEach(section => {
      if (added) return;
      const text = section.textContent.toLowerCase();
      
      if ((text.includes('recruitment') || text.includes('join')) && !section.querySelector('.multi-school-highlight')) {
        const highlight = document.createElement('div');
        highlight.className = 'multi-school-highlight reveal';
        highlight.innerHTML = `
          <div style="background: rgba(80, 160, 255, 0.08); border-left: 4px solid #50a0ff; padding: 1.5rem; border-radius: 8px; margin: 1.5rem 0;">
            <p style="color: #50a0ff; font-weight: 700; margin-bottom: 0.5rem;">🎓 Multi-School Team</p>
            <p style="color: #aaa; font-size: 0.95rem;">Our team members come from 5+ different Austin-area schools including LASA, Westlake, Bowie, Austin High, and Canyon Ridge. We believe diversity of thought and background makes us stronger.</p>
          </div>
        `;
        const firstCard = section.querySelector('.card-grid, .card');
        if (firstCard) {
          firstCard.parentNode.insertBefore(highlight, firstCard);
        } else {
          section.appendChild(highlight);
        }
        added = true;
      }
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addRecruitmentHighlight);
  } else {
    addRecruitmentHighlight();
  }
})();
