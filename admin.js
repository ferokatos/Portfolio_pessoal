import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, deleteDoc, getDocs, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

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
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// DOM Elements
const loginSection = document.getElementById("login-section");
const adminContent = document.getElementById("admin-content");

// Auth State Observer
onAuthStateChanged(auth, async (user) => {
  if (user) {
    loginSection.classList.add("hidden");
    adminContent.classList.remove("hidden");
    loadSobreMim();
  } else {
    loginSection.classList.remove("hidden");
    adminContent.classList.add("hidden");
  }
});

// Login
document.getElementById("btn-login").addEventListener("click", () => {
  const email = document.getElementById("login-email").value;
  const pass = document.getElementById("login-password").value;
  signInWithEmailAndPassword(auth, email, pass).catch(error => {
    document.getElementById("login-error").style.display = "block";
  });
});

// Logout
document.getElementById("btn-logout").addEventListener("click", () => {
  signOut(auth);
});

// Load Sobre Mim
async function loadSobreMim() {
  const docRef = doc(db, "portfolio", "sobre");
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    document.getElementById("sobre-mim-text").value = docSnap.data().texto;
  }
}

// Save Sobre Mim
document.getElementById("btn-save-sobre").addEventListener("click", async () => {
  const text = document.getElementById("sobre-mim-text").value;
  await setDoc(doc(db, "portfolio", "sobre"), { texto: text });
  alert("Sobre mim salvo!");
});

// Type Toggle
const typeSelect = document.getElementById("project-type");
const webOptions = document.getElementById("web-options");
const desktopOptions = document.getElementById("desktop-options");

typeSelect.addEventListener("change", () => {
  if (typeSelect.value === "web") {
    webOptions.classList.remove("hidden");
    desktopOptions.classList.add("hidden");
  } else {
    webOptions.classList.add("hidden");
    desktopOptions.classList.remove("hidden");
  }
});

// Save Stack
document.getElementById("btn-save-stack").addEventListener("click", async () => {
  const name = document.getElementById("stack-name").value;
  const file = document.getElementById("stack-icon").files[0];
  if (!name || !file) return alert("Preencha tudo!");

  const storageRef = ref(storage, 'stacks/' + file.name);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);

  await addDoc(collection(db, "stacks"), { name, iconUrl: url });
  alert("Stack salva!");
});

// Save Project
document.getElementById("btn-save-project").addEventListener("click", async () => {
  const title = document.getElementById("project-title").value;
  const desc = document.getElementById("project-desc").value;
  const colab = document.getElementById("project-colab").value;
  const type = typeSelect.value;
  let mediaUrl = "";

  if (!title || !desc) return alert("Preencha título e descrição");

  if (type === "desktop") {
    const file = document.getElementById("project-video").files[0];
    if (!file) return alert("Selecione um vídeo!");
    const storageRef = ref(storage, 'projects/' + file.name);
    await uploadBytes(storageRef, file);
    mediaUrl = await getDownloadURL(storageRef);
  } else {
    mediaUrl = document.getElementById("project-link").value;
    if (!mediaUrl) return alert("Digite o link web!");
  }

  await addDoc(collection(db, "projects"), {
    title,
    description: desc,
    collaborators: colab,
    type,
    mediaUrl,
    createdAt: new Date()
  });

  alert("Projeto salvo com sucesso!");
});

// ==========================================
// MINI SESSIONS LOGIC
// ==========================================

// Save Mini Session
document.getElementById("btn-save-mini").addEventListener("click", async () => {
  const type = document.getElementById("mini-type").value;
  const title = document.getElementById("mini-title").value;
  const institution = document.getElementById("mini-inst").value;
  const period = document.getElementById("mini-period").value;
  const desc = document.getElementById("mini-desc").value;
  const link = document.getElementById("mini-link").value;

  const editId = document.getElementById("edit-mini-id").value;

  if (!title || !institution) return alert("Preencha título e instituição!");

  const dataToSave = {
    type,
    title,
    institution,
    period,
    description: type === "experiencias" ? desc : "",
    link
  };

  if (editId) {
    // Modo de edição
    await updateDoc(doc(db, "mini_sessions", editId), dataToSave);
    alert("Item atualizado com sucesso!");
    document.getElementById("btn-save-mini").textContent = "Salvar Item";
    document.getElementById("btn-cancel-mini").classList.add("hidden");
    document.getElementById("edit-mini-id").value = "";
  } else {
    // Modo de criação
    dataToSave.createdAt = new Date();
    await addDoc(collection(db, "mini_sessions"), dataToSave);
    alert("Item adicionado com sucesso!");
  }

  // Clear inputs
  document.getElementById("mini-title").value = "";
  document.getElementById("mini-inst").value = "";
  document.getElementById("mini-period").value = "";
  document.getElementById("mini-desc").value = "";
  document.getElementById("mini-link").value = "";
  
  loadMiniSessions(); // Atualiza a lista
});

// Cancelar Edição
document.getElementById("btn-cancel-mini").addEventListener("click", () => {
  document.getElementById("mini-title").value = "";
  document.getElementById("mini-inst").value = "";
  document.getElementById("mini-period").value = "";
  document.getElementById("mini-desc").value = "";
  document.getElementById("mini-link").value = "";
  document.getElementById("edit-mini-id").value = "";
  
  document.getElementById("btn-save-mini").textContent = "Salvar Item";
  document.getElementById("btn-cancel-mini").classList.add("hidden");
});

// Load Mini Sessions list for deletion
async function loadMiniSessions() {
  const miniList = document.getElementById("mini-list");
  if (!miniList) return;
  
  miniList.innerHTML = "Carregando...";
  const snap = await getDocs(collection(db, "mini_sessions"));
  miniList.innerHTML = "";
  
  if (snap.empty) {
    miniList.innerHTML = "<p style='color:var(--overlay);'>Nenhum item adicionado ainda.</p>";
    return;
  }

  snap.forEach(docSnap => {
    const data = docSnap.data();
    const itemDiv = document.createElement("div");
    itemDiv.style.display = "flex";
    itemDiv.style.justifyContent = "space-between";
    itemDiv.style.alignItems = "center";
    itemDiv.style.background = "rgba(255,255,255,0.05)";
    itemDiv.style.padding = "10px";
    itemDiv.style.borderRadius = "6px";
    
    itemDiv.innerHTML = `
      <div style="color:var(--text); font-size:0.9rem;">
        <strong style="color:var(--purple);">[${data.type.toUpperCase()}]</strong> ${data.title} - ${data.institution}
      </div>
      <div style="display: flex; gap: 5px;">
        <button class="btn-edit" data-id="${docSnap.id}" style="background: var(--blue, #89b4fa); color: #1e1e2e; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-weight: bold;">Editar</button>
        <button class="btn-delete" data-id="${docSnap.id}" style="background: var(--red, #f38ba8); color: #1e1e2e; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-weight: bold;">Remover</button>
      </div>
    `;
    
    // Anexar dados completos ao botão para facilitar a edição
    const editBtn = itemDiv.querySelector('.btn-edit');
    editBtn.dataset.itemData = JSON.stringify(data);
    
    miniList.appendChild(itemDiv);
  });

  // Attach delete events
  document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.target.getAttribute('data-id');
      if (confirm("Tem certeza que deseja deletar este item?")) {
        await deleteDoc(doc(db, "mini_sessions", id));
        alert("Item Removido!");
        loadMiniSessions();
      }
    });
  });

  // Attach edit events
  document.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.target.getAttribute('data-id');
      const data = JSON.parse(e.target.dataset.itemData);

      // Preencher o formulário
      document.getElementById("mini-type").value = data.type;
      document.getElementById("mini-title").value = data.title || "";
      document.getElementById("mini-inst").value = data.institution || "";
      document.getElementById("mini-period").value = data.period || "";
      document.getElementById("mini-desc").value = data.description || "";
      document.getElementById("mini-link").value = data.link || "";
      document.getElementById("edit-mini-id").value = id;

      // Disparar o evento change no select para mostrar/esconder a descrição
      document.getElementById("mini-type").dispatchEvent(new Event('change'));

      // Mudar botões
      document.getElementById("btn-save-mini").textContent = "Atualizar Item";
      document.getElementById("btn-cancel-mini").classList.remove("hidden");
      
      // Rolar para o formulário
      document.getElementById("mini-type").scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });
}

// Toggle Description Field for Experiencias
const miniTypeSelect = document.getElementById("mini-type");
const miniDescContainer = document.getElementById("mini-desc-container");
miniTypeSelect.addEventListener("change", () => {
  if (miniTypeSelect.value === "experiencias") {
    miniDescContainer.classList.remove("hidden");
  } else {
    miniDescContainer.classList.add("hidden");
  }
});

// Chamar ao carregar
onAuthStateChanged(auth, async (user) => {
  if (user) {
    loadMiniSessions();
  }
});
