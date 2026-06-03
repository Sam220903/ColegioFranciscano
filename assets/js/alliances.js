const allies = [
  {
    name: "Universidad La Salle",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    logo: "assets/images/allies1.png"
  },
  {
    name: "Club Falei",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    logo: "assets/images/allies2.png"
  },
  {
    name: "Apple Teacher",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    logo: "assets/images/allies3-1.png"
  },
  {
    name: "Dehan Matemáticas",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    logo: "assets/images/allies4-1.png"
  },
  {
    name: "Organización Impulsora de Valores",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    logo: "assets/images/allies5.jpg"
  }
];

function initAllies() {
  const panel         = document.getElementById('ally-panel');
  const panelLogo     = document.getElementById('ally-panel-logo');
  const panelName     = document.getElementById('ally-panel-name');
  const panelDesc     = document.getElementById('ally-panel-desc');
  const closeBtn      = document.getElementById('ally-panel-close');
  const alliancesList = document.getElementById('alliances-list');

  if (!panel) return;

  document.querySelectorAll('[data-ally]').forEach(img => {
    img.addEventListener('click', () => {
      const data = allies[img.dataset.ally];
      panelLogo.src         = data.logo;
      panelName.textContent = data.name;
      panelDesc.textContent = data.desc;
      panel.classList.add('open');
      alliancesList.classList.add('panel-open');
    });
  });

  closeBtn.addEventListener('click', () => {
    panel.classList.remove('open');
    alliancesList.classList.remove('panel-open');
  });
}

initAllies();