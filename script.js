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