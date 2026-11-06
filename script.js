import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, getDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDmrvqnrUPj7-ELsGmmAvFUYJmrXtdm5i8",
  authDomain: "portfolio-pessoal-b82d2.firebaseapp.com",
  projectId: "portfolio-pessoal-b82d2",
  storageBucket: "portfolio-pessoal-b82d2.firebasestorage.app",
  messagingSenderId: "334720363277",
  appId: "1:334720363277:web:9929cbb150b10a4ca11e44",
  measurementId: "G-WFLX73DYG2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function calcularIdade(dia, mes, ano) {
  const hoje = new Date();        
  const anoAtual = hoje.getFullYear(); 
  const mesAtual = hoje.getMonth() + 1; 
  const diaAtual = hoje.getDate();  

  let idade = anoAtual - ano;      

  if (mesAtual >= mes) {
    if (diaAtual >= dia) {
      return idade;                
    } else {
      return idade - 1;           
    }
  } else {
    return idade - 1;              
  }
}

const minhaIdade = calcularIdade(17, 6, 2006);
const idadeEl = document.getElementById('idade');
if (idadeEl) {
    idadeEl.textContent = minhaIdade;
}

function calcularSemestre(ano = 2025) {
    const dataAtual = new Date();
    const anosPassados = dataAtual.getFullYear() - ano;
    let semestre = anosPassados * 2;
    if ((dataAtual.getMonth() + 1) <= 6) {
        semestre += 1;
    } else {
        semestre += 2;
    }
    return semestre;
}

const semestreEl = document.getElementById('semestre');
if (semestreEl) {
    semestreEl.textContent = `${calcularSemestre()}º`;
}

//pega o ano atual
const anoEl = document.getElementById('ano');
if (anoEl) {
    anoEl.textContent = new Date().getFullYear();
}

// Atualiza a barrinha de navegação ativa ao rolar a página
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('nav ul li a');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        
        // Quando a página rola para dentro da seção (com um respiro de 150px pro menu flutuante)
        if (pageYOffset >= (sectionTop - 150)) { 
            current = section.getAttribute('id');
        }
    });

    // Se o usuário rolou até o final da página, marca a última seção como ativa
    if ((window.innerHeight + Math.round(window.scrollY)) >= document.body.offsetHeight - 2) {
        if (sections.length > 0) {
            current = sections[sections.length - 1].getAttribute('id');
        }
    }

    navLinks.forEach(link => {
        link.classList.remove('active');
        // Adiciona a classe 'active' ao link que tiver o mesmo id no href
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ==========================================
// FIREBASE DYNAMIC CONTENT LOADER
// ==========================================
async function loadDynamicContent() {
  // Load Sobre Mim
  try {
    const sobreDoc = await getDoc(doc(db, "portfolio", "sobre"));
    if (sobreDoc.exists()) {
      let texto = sobreDoc.data().texto;
      // Substitui as tags customizadas pelos valores calculados pelo script
      texto = texto.replace("[IDADE]", minhaIdade);
      texto = texto.replace("[SEMESTRE]", `${calcularSemestre()}º`);
      document.getElementById("sobre-mim-conteudo").innerHTML = texto;
    }
  } catch (e) {
    console.error("Erro ao carregar sobre", e);
  }

  // Load Stacks
  try {
    const stacksSnap = await getDocs(collection(db, "stacks"));
    const techIconsDiv = document.querySelector(".tech-icons");
    if (!stacksSnap.empty) {
      techIconsDiv.innerHTML = ""; // limpa os estáticos
      stacksSnap.forEach(docSnap => {
        const data = docSnap.data();
        techIconsDiv.innerHTML += `
          <div class="icon-wrapper" title="${data.name}">
            <img src="${data.iconUrl}" alt="${data.name}" />
          </div>
        `;
      });
    }
  } catch(e) {
     console.error("Erro ao carregar stacks", e);
  }

  // Load Projects
  try {
    const projectsSnap = await getDocs(collection(db, "projects"));
    const projetosGrid = document.querySelector(".projetos-grid");
    if (!projectsSnap.empty) {
      projetosGrid.innerHTML = ""; // limpa os hardcoded
      projectsSnap.forEach(docSnap => {
        const p = docSnap.data();
        let mediaHtml = "";
        let actionsHtml = "";

        if (p.type === "web") {
          mediaHtml = `
            <iframe
              src="${p.mediaUrl}"
              title="${p.title}"
              frameborder="0"
              allowfullscreen
            ></iframe>
          `;
          actionsHtml = `
            <div class="card-actions">
              <a href="${p.mediaUrl}" class="btn-projeto" target="_blank" rel="noopener noreferrer">
                <img src="icons/external-link.svg" alt="Visitar" />
                Ver Projeto
              </a>
            </div>
          `;
        } else {
          mediaHtml = `
            <video src="${p.mediaUrl}" autoplay muted loop playsinline></video>
          `;
        }

        projetosGrid.innerHTML += `
          <div class="card reveal" data-tipo="${p.type}">
            <div class="card-media">
              ${mediaHtml}
            </div>
            <div class="card-content">
              <h3>${p.title}</h3>
              <p>${p.description}</p>
              <div class="card-footer">
                <h4>Colaboradores</h4>
                <p>${p.collaborators}</p>
              </div>
              ${actionsHtml}
            </div>
          </div>
        `;
      });
      
      // Observar novos cards
      setTimeout(() => {
        document.querySelectorAll('.projetos-grid .card.reveal').forEach(el => {
          if (window.revealObserver) window.revealObserver.observe(el);
        });
      }, 100);
    }
  } catch(e) {
    console.error("Erro ao carregar projetos", e);
  }

  // Load Mini Sessions
  try {
    const miniSnap = await getDocs(collection(db, "mini_sessions"));
    const tlFormacao = document.getElementById("timeline-formacao");
    const tlExperiencias = document.getElementById("timeline-experiencias");
    const tlCertificados = document.getElementById("timeline-certificados");
    
    if (!miniSnap.empty) {
      if (tlFormacao) tlFormacao.innerHTML = "";
      if (tlExperiencias) tlExperiencias.innerHTML = "";
      if (tlCertificados) tlCertificados.innerHTML = "";

      let items = [];
      miniSnap.forEach(docSnap => items.push({ id: docSnap.id, ...docSnap.data() }));
      
      // Ordenando pelos criados mais recentemente primeiro
      items.sort((a,b) => {
         const tA = a.createdAt ? a.createdAt.seconds : 0;
         const tB = b.createdAt ? b.createdAt.seconds : 0;
         return tB - tA; 
      });

      items.forEach(item => {
        let linkHtml = item.link ? `<br><a href="${item.link}" target="_blank" class="link-certificado">Ver Detalhes</a>` : "";
        let periodHtml = item.period ? `<p class="periodo">${item.period}</p>` : "";
        
        let isExp = item.type === "experiencias";
        let descHtml = "";
        if (isExp && item.description) {
          const linhas = item.description.split('\n').filter(l => l.trim() !== '');
          const listaHtml = linhas.map(l => {
            let textoLimpo = l.trim().replace(/^[-*•]\s*/, '');
            // Se o usuário copiou com '->' ou algo do tipo, vamos limpar também
            textoLimpo = textoLimpo.replace(/^[-=]>\s*/, '');
            return `<li style="margin-bottom: 12px; list-style-type: none; position: relative; padding-left: 20px; font-size: 0.95rem; line-height: 1.5; color: var(--text);">
                      <span style="position: absolute; left: 0; top: 0; color: var(--blue, #89b4fa); font-weight: bold;">&rarr;</span>
                      ${textoLimpo}
                    </li>`;
          }).join('');
          descHtml = `<div class="timeline-desc" style="margin-top: 15px;"><ul style="padding-left: 0; margin: 0;">${listaHtml}</ul></div>`;
        }
        let extraClass = isExp && item.description ? "has-desc" : "";
        let clickEvent = isExp && item.description ? `onclick="this.classList.toggle('expanded')"` : "";

        const html = `
          <div class="timeline-item reveal ${extraClass}" ${clickEvent}>
            <div class="timeline-dot"></div>
            <h4>${item.title}</h4>
            <p class="instituicao">${item.institution}</p>
            ${periodHtml}
            ${descHtml}
            ${linkHtml}
          </div>
        `;

        if (item.type === "formacao" && tlFormacao) tlFormacao.innerHTML += html;
        else if (item.type === "experiencias" && tlExperiencias) tlExperiencias.innerHTML += html;
        else if (item.type === "certificados" && tlCertificados) tlCertificados.innerHTML += html;
      });
      
      // Observar novos itens da timeline
      setTimeout(() => {
        document.querySelectorAll('.timeline-item.reveal').forEach(el => {
          if (window.revealObserver) window.revealObserver.observe(el);
        });
      }, 100);
    }
  } catch (e) {
    console.error("Erro ao carregar mini sessions", e);
  }
}

loadDynamicContent();

// ==========================================
// TABS LOGIC
// ==========================================
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    tabPanes.forEach(p => p.classList.remove('active'));
    
    btn.classList.add('active');
    const targetId = btn.getAttribute('data-tab');
    if (document.getElementById(targetId)) {
        document.getElementById(targetId).classList.add('active');
    }
  });
});

// ==========================================
// MODAL DE MÍDIA
// ==========================================
const modal = document.createElement('div');
modal.id = 'media-modal';
modal.className = 'modal';
modal.innerHTML = `
  <span class="modal-close">&times;</span>
  <div class="modal-content" id="modal-body"></div>
`;
document.body.appendChild(modal);

const modalBody = document.getElementById('modal-body');
const modalClose = modal.querySelector('.modal-close');

function closeModal() {
  modal.classList.remove('active');
  modalBody.innerHTML = ''; // Limpar conteúdo ao fechar (para parar vídeo/iframe)
}

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

// Delegação de eventos para os vídeos e iframes
document.querySelector('.projetos-grid').addEventListener('click', (e) => {
  const cardMedia = e.target.closest('.card-media');
  if (!cardMedia) return;

  // Ignorar cliques se não houver video/iframe
  const mediaElement = cardMedia.querySelector('video, iframe');
  if (mediaElement) {
    let clonedMedia;
    if (mediaElement.tagName === 'VIDEO') {
      clonedMedia = document.createElement('video');
      clonedMedia.src = mediaElement.src;
      clonedMedia.controls = true; // Mostrar controles no modal
      clonedMedia.autoplay = true;
    } else {
      clonedMedia = document.createElement('iframe');
      clonedMedia.src = mediaElement.src;
      clonedMedia.allowFullscreen = true;
    }
    modalBody.innerHTML = '';
    modalBody.appendChild(clonedMedia);
    modal.classList.add('active');
  }
});

// ==========================================
// BOTÃO VOLTAR AO TOPO
// ==========================================
const btnBackToTop = document.getElementById('btn-back-to-top');

window.addEventListener('scroll', () => {
  // Mostra o botão após rolar 300px para baixo
  if (window.scrollY > 300) {
    btnBackToTop.classList.add('show');
  } else {
    btnBackToTop.classList.remove('show');
  }
});

btnBackToTop.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// ==========================================
// SCROLL REVEAL ANIMATION
// ==========================================
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      
      // Remove a classe reveal após a animação para não quebrar o hover dos cards
      setTimeout(() => {
        entry.target.classList.remove('reveal', 'active');
      }, 850); // 850ms (pouco depois dos 800ms da animação)

      observer.unobserve(entry.target); // Animar apenas na primeira vez
    }
  });
}, {
  root: null,
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px"
});

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
  });
});

window.revealObserver = revealObserver;