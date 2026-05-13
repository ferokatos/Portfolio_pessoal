// Calcula a idade atual — mesma lógica do seu Python!
function calcularIdade(dia, mes, ano) {
  const hoje = new Date();         // equivalente ao datetime.datetime.now()
  const anoAtual = hoje.getFullYear(); // .year
  const mesAtual = hoje.getMonth() + 1; // .month (JS começa do 0, por isso +1)
  const diaAtual = hoje.getDate();  // .day

  let idade = anoAtual - ano;      // diferença de anos

  if (mesAtual >= mes) {
    if (diaAtual >= dia) {
      return idade;                // já fez aniversário esse mês
    } else {
      return idade - 1;            // ainda não fez o dia
    }
  } else {
    return idade - 1;              // ainda não chegou o mês
  }
}

// Chama a função com sua data de nascimento
const minhaIdade = calcularIdade(17, 6, 2006);

// Coloca a idade no HTML automaticamente
document.getElementById('idade').textContent = minhaIdade;

function calcularSemestre(ano = 2025) {

    // pega a data atual
    const dataAtual = new Date();

    // calcula quantos anos passaram
    const anosPassados =
        dataAtual.getFullYear() - ano;

    // cada ano possui 2 semestres
    let semestre = anosPassados * 2;

    // verifica semestre atual
    if ((dataAtual.getMonth() + 1) <= 6) {
        semestre += 1;
    } else {
        semestre += 2;
    }

    return semestre;
}

document.getElementById('semestre').textContent =
    `${calcularSemestre()}º`;