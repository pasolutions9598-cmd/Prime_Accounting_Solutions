<script type="module">  
        import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'  
  
        const SUPABASE_URL = "https://ariqthzhspzktpoylqci.supabase.co";  
        const SUPABASE_KEY = "sb_publishable_GYSUR2xyPzrHvD0fapWjuA_6gr6_RTp";  
        const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);  
  
        // --- VISITOR COUNTER REGISTRY ---  
        async function incrementVisitorCount() {  
            try {  
                const { data: analytics, error: fetchError } = await supabase  
                    .from('site_analytics')  
                    .select('visitor_count')  
                    .eq('id', 'main_site')  
                    .maybeSingle();  
  
                if (fetchError) throw fetchError;  
  
                if (analytics) {  
                    const currentCount = analytics.visitor_count || 0;  
                    const newCount = currentCount + 1;  
  
                    const { error: updateError } = await supabase  
                        .from('site_analytics')  
                        .update({ visitor_count: newCount })  
                        .eq('id', 'main_site');  
  
                    if (updateError) throw updateError;  
                }  
            } catch (err) {  
                console.error("Counter Error: ", err);  
            }  
        }  
        incrementVisitorCount();  
  
        // Popup operational frame  
        window.addEventListener('DOMContentLoaded', () => {  
            setTimeout(() => {  
                const popup = document.getElementById('welcomePopup');  
                if(popup) popup.classList.add('show');  
            }, 1000);  
        });  
  
        const closeBtn = document.getElementById('closePopupBtn');  
        if(closeBtn) {  
            closeBtn.addEventListener('click', () => {  
                document.getElementById('welcomePopup').classList.remove('show');  
            });  
        }  
  
        // Accordion (FAQ) interactive matrix logic  
        document.querySelectorAll('.faq-question').forEach(item => {  
            item.addEventListener('click', () => {  
                const parent = item.parentElement;  
                if (parent.classList.contains('active')) {  
                    parent.classList.remove('active');  
                } else {  
                    document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('active'));  
                    parent.classList.add('active');  
                }  
            });  
        });  
  
        // Typing carousel modules  
        const phrases = ["Traders & Startups", "Retailers & MSMEs", "Small Businesses"];  
        let count = 0; let index = 0; let currentText = ""; let letter = "";  
  
        (function type() {  
            if (count === phrases.length) { count = 0; }  
            currentText = phrases[count];  
            letter = currentText.slice(0, ++index);  
  
            const typingElement = document.getElementById("typing-text");  
            if (typingElement) {  
                typingElement.textContent = letter;  
            }  
            if (letter.length === currentText.length) {  
                setTimeout(() => {  
                    index = 0; count++;  
                    setTimeout(type, 200);  
                }, 2000);  
            } else {  
                setTimeout(type, 100);  
            }  
        }());  
  
        // Live Feed Dispatch Registry  
        async function fetchLiveFeed() {  
            const feedContainer = document.getElementById("liveFeedContainer");  
if(!feedContainer) return;  
            try {  
                const { data: posts, error } = await supabase  
                    .from('posts')  
                    .select('id, title, content, type, category, status, image, created_at')  
                    .eq('status', 'published')  
                    .order('created_at', { ascending: false });  
  
                if (error) throw error;  
  
                if (!posts || posts.length === 0) {  
                    feedContainer.innerHTML = "<p>No recent announcements logged in the broadcast registry.</p>";  
                    return;  
                }  
  
                feedContainer.innerHTML = "";  
                posts.forEach(post => {  
                    let imageTag = "";  
                    if (post.image && post.image.trim() !== "") {  
                        imageTag = `<img src="${post.image}" alt="Post Compliance Image" class="feed-image" onerror="this.style.display='none';">`;  
                    }  
  
                    feedContainer.innerHTML += `  
                        <div class="feed-card">  
                            ${imageTag}  
                            <span class="feed-badge badge-${(post.category || 'general').toLowerCase().replace(' ', '')}">${post.category || 'General'}</span>  
                            <h4 style="margin-bottom:10px; font-size:17px;">${post.title}</h4>  
                            <p style="font-size:14px; white-space:pre-wrap;">${post.content}</p>  
                        </div>  
                    `;  
                });  
            } catch (err) {  
                console.error(err);  
                feedContainer.innerHTML = "<p style='color:#ef4444;'>Unable to load real-time compliance feed repository.</p>";  
            }  
        }  
        fetchLiveFeed();  
  
        // Database Client Testimonials Router  
        async function fetchWebTestimonials() {  
            const testimonialContainer = document.getElementById("liveTestimonialsContainer");  
            if(!testimonialContainer) return;  
            try {  
                const { data: testimonials, error } = await supabase  
                    .from('testimonials')  
                    .select('*')  
                    .eq('status', 'published')  
                    .order('id', { ascending: false });  
  
                if (error) throw error;  
  
                if (!testimonials || testimonials.length === 0) {  
                    return; // Retains static fallbacks safely  
                }  
  
                testimonialContainer.innerHTML = "";   
  
                testimonials.forEach(item => {  
                    let starIcons = "";  
                    for (let i = 0; i < item.rating; i++) {  
                        starIcons += `<i class="fa-solid fa-star"></i>`;  
                    }  
  
                    testimonialContainer.innerHTML += `  
                        <div class="testimonial-card">  
                            <i class="fa-solid fa-quote-right quote-icon"></i>  
                            <div class="stars-rating">${starIcons}</div>  
                            <p style="margin-bottom:15px;">"${item.review}"</p>  
                            <strong>${item.client_name}</strong>  
                            ${item.company_name ? `<br><small style="color:#64748b; font-size:12px;">${item.company_name}</small>` : ''}  
                        </div>  
                    `;  
                });  
            } catch (err) {  
                console.error(err);  
            }  
        }  
        fetchWebTestimonials();  
  
        // Appointment Execution Router  
        const aptForm = document.getElementById('appointmentForm');  
        if(aptForm) {  
            aptForm.addEventListener('submit', function(e) {  
e.preventDefault();  
                const name = document.getElementById('aptName').value;  
                const phone = document.getElementById('aptPhone').value;  
                const date = document.getElementById('aptDate').value;  
                const service = document.getElementById('aptService').value;  
  
                const messageString = `*New Booking Request Received*\n\n*Client Name:* ${name}\n*Contact Line:* ${phone}\n*Date Window:* ${date}\n*Target Module:* ${service}`;  
                window.open(`https://wa.me/916394748563?text=${encodeURIComponent(messageString)}`, '_blank');  
            });  
        }  
  
        // Lead Forms Router  
        const waForm = document.getElementById('whatsappForm');  
        if(waForm) {  
            waForm.addEventListener('submit', function(e) {  
                e.preventDefault();  
                const name = document.getElementById('formName').value;  
                const email = document.getElementById('formEmail').value;  
                const phone = document.getElementById('formPhone').value;  
                const msg = document.getElementById('formMessage').value;  
  
                const textMessage = `*New Enquiry Received* \n\n*Name/Enterprise:* ${name}\n*Email:* ${email}\n*Phone:* ${phone}\n*Message:* ${msg}`;  
                window.open(`https://wa.me/916394748563?text=${encodeURIComponent(textMessage)}`, '_blank');  
            });  
        }  
  
        // Review Widget Engine  
        let selectedRating = 5;  
        const toggleBtn = document.getElementById('toggleReviewBtn');  
        const formContainer = document.getElementById('reviewFormContainer');  
        const stars = document.querySelectorAll('#starRatingInput i');  
  
        if(toggleBtn && formContainer) {  
            toggleBtn.addEventListener('click', () => {  
                if (formContainer.classList.contains('open')) {  
                    formContainer.classList.remove('open');  
                    toggleBtn.innerHTML = `<i class="fa-solid fa-pen-to-square"></i> Write A Review Here`;  
                } else {  
                    formContainer.classList.add('open');  
                    toggleBtn.innerHTML = `<i class="fa-solid fa-xmark"></i> Close Review Form`;  
                }  
            });  
        }  
  
        stars.forEach(star => {  
            star.addEventListener('click', () => {  
                selectedRating = parseInt(star.getAttribute('data-rating'));  
                stars.forEach(s => {  
                    if (parseInt(s.getAttribute('data-rating')) <= selectedRating) {  
                        s.classList.add('active');  
                    } else {  
                        s.classList.remove('active');  
                    }  
                });  
            });  
        });  
  
        const dirReviewForm = document.getElementById('directReviewForm');  
        if(dirReviewForm) {  
            dirReviewForm.addEventListener('submit', function(e) {  
                e.preventDefault();  
                const name = document.getElementById('revName').value;  
                const message = document.getElementById('revMessage').value;  
                let starString = "⭐".repeat(selectedRating);  
  
                const waMessage = `*New Client Review Logs*\n\n*Enterprise/Name:* ${name}\n*Rating Score:* ${starString}\n*Feedback Note:* ${message}`;  
                window.open(`https://wa.me/916394748563?text=${encodeURIComponent(waMessage)}`, '_blank');  
            });  
        }  
    </script>  <script>  
window.addEventListener("scroll", function () {  
    const header = document.querySelector("header");  
    if (window.scrollY > 60) {  
        header.classList.add("scrolled");  
    } else {  
        header.classList.remove("scrolled");  
    }  
});  
</script>
