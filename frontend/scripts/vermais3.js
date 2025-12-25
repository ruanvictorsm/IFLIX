fetch("http://localhost:3000/api/conteudo")
    .then(res => res.json())
    .then(data => {
        const lista = document.getElementById("lista-livro");

        data
            .filter(item => item.tipo === "Livro")
            .forEach(item => {
                const card = document.createElement("div");
                card.classList.add("card-obra");

                card.innerHTML = `
                    <img src="${item.url}" alt="${item.titulo}">
                `;

                lista.appendChild(card);
                card.addEventListener('click', () => {
                    document.getElementById('modal-titulo').textContent = item.titulo;
                    document.getElementById('modal-genero').textContent = item.genero || '';
                    document.getElementById('modal-descricao').textContent = item.descricao || 'Sem descrição.';
                    document.getElementById('modal-anotacoes').href = 'anotacoes.html?id=' + item.id;
                    document.getElementById('modal-disponivel').textContent = 'Disponível na: ' + (item.plataformas || 'Plataforma não inserida');

                    const carousel = document.getElementById('modal-carousel');
                    carousel.innerHTML = '';

                    const slides = [];

                    // Slide 1 - imagem principal
                    slides.push(`<div class="imgCarr"><img src="${item.url}" alt="Imagem da obra"></div>`);

                    // Slide 2 - vídeo 1 (trailer)
                    if (item.trailer) {
                        slides.push(`<div><iframe src="${item.trailer}" frameborder="0" REFERRERPOLICY="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`);
                    }

                    // Slide 3 - vídeo 2 (resenha)
                    if (item.resenha) {
                        slides.push(`<div><iframe src="${item.resenha}" frameborder="0" REFERRERPOLICY="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`);
                    }

                    carousel.innerHTML = slides.join('');

                    // ====== Lógica do carrossel manual ======
                    let currentSlide = 0;
                    const totalSlides = slides.length;

                    const updateCarousel = () => {
                        carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
                    };

                    const prevBtn = document.querySelector('.prev-btn');
                    const nextBtn = document.querySelector('.next-btn');

                    prevBtn.onclick = () => {
                        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
                        updateCarousel();
                    };
                    nextBtn.onclick = () => {
                        currentSlide = (currentSlide + 1) % totalSlides;
                        updateCarousel();
                    };

                    modal2.style.display = 'flex';
                    overlay.style.display = 'block';

                    updateCarousel();
                });
            });
        // ===== Fechar modal e overlay =====
        const overlay = document.getElementById('overlay');
        overlay.addEventListener('click', () => {
            const modals = document.querySelectorAll('#modal2, #modal');
            modals.forEach(modal => modal.style.display = 'none');
            overlay.style.display = 'none';
        });

        document.querySelectorAll('[data-close]').forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.dataset.close;
                const target = document.getElementById(targetId);
                if (target) {
                    target.style.display = 'none';
                    overlay.style.display = 'none';
                }
            });
        });
    });