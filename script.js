
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


document.getElementById('idade').textContent = minhaIdade;

function calcularSemestre(ano = 2025) {

   
    const dataAtual = new Date();

  
    const anosPassados =
        dataAtual.getFullYear() - ano;

    
    let semestre = anosPassados * 2;

   
    if ((dataAtual.getMonth() + 1) <= 6) {
        semestre += 1;
    } else {
        semestre += 2;
    }

    return semestre;
}

document.getElementById('semestre').textContent =
     `${calcularSemestre()}º`;


//pega o ano atual
document.getElementById('ano').textContent = new Date().getFullYear();