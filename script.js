// ============================================
// FUNÇÕES AUXILIARES
// ============================================
const fmt = (v) => "R$ " + (Number.isFinite(Number(v)) ? Number(v) : 0).toLocaleString("pt-BR", {minimumFractionDigits:2, maximumFractionDigits:2});
const dat = (d) => d ? moment(d).format("DD/MM/YYYY") : "Não informada";
const fmtCurto = (v) => {
    const valor = Number(v) || 0;
    if (Math.abs(valor) >= 1000000) return "R$ " + (valor / 1000000).toLocaleString("pt-BR", {maximumFractionDigits:1}) + " mi";
    if (Math.abs(valor) >= 1000) return "R$ " + (valor / 1000).toLocaleString("pt-BR", {maximumFractionDigits:0}) + " mil";
    return fmt(valor);
};
const escapar = (v) => String(v ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[c]));
const projetoIdParaGasto = (id) => id.replaceAll("-", " ");
const chartColors = ["#1d4f91", "#0f7490", "#3b82f6", "#52657a", "#7aa6d8", "#536d9c", "#255f85", "#8797ad"];
const rubricColorMap = {
    "SPCD": "#1d4f91",
    "PASSAGENS": "#0f7490",
    "DIÁRIAS": "#7aa6d8",
    "CLT": "#52657a",
    "BOLSA": "#8797ad",
    "REEMBOLSO": "#536d9c"
};
const corRubrica = (rubrica, index = 0) => rubricColorMap[rubrica] || chartColors[index % chartColors.length];

// ============================================
// TOTAIS CORRETOS (FORÇADOS MANUALMENTE)
// ============================================
const TOTAL_SALDO_DI = 4003044.87;
const TOTAL_SALDO_GERAL = 80380089.63;

// ============================================
// DADOS COMPLETOS (129 GASTOS)
// ============================================
const gastos = [
{item:1,valor:40000,data:"2026-01-06",projeto:"GEREB 031 FIO 23",rubrica:"SPCD",area:"GABINETE",descricao:"EVENTO: 14º CONGRESSO BRASILEIRO DE SAÚDE COLETIVA.",favorecido:"KINGSMAN SOLUCOES EM EVENTOS LTDA",meta:3,modalidade:"SPCD"},
{item:2,valor:3952.38,data:"2026-01-14",projeto:"GEREB 007 FIO 20",rubrica:"PASSAGENS",area:"GABINETE",descricao:"REUNIÃO COM PRESIDENTE DA FIOCRUZ BRASÍLIA - DR MÁRIO MOREIRA",favorecido:"MARIA FABIANA DAMÁSIO PASSOS",meta:4,modalidade:"PASSAGENS"},
{item:3,valor:570,data:"2026-01-14",projeto:"GEREB 007 FIO 20",rubrica:"DIÁRIAS",area:"GABINETE",descricao:"REUNIÃO COM PRESIDENTE DA FIOCRUZ BRASÍLIA",favorecido:"MARIA FABIANA DAMÁSIO PASSOS",meta:4,modalidade:"DIÁRIAS"},
{item:4,valor:2249.9,data:"2026-01-12",projeto:"GEREB 007 FIO 20",rubrica:"PASSAGENS",area:"ESCOLA DE GOVERNO FIOCRUZ",descricao:"PARTICIPAR DO II SEMINÁRIO STEM NA SAÚDE",favorecido:"NOELY FABIANA OLIVEIRA DE MOURA",meta:4,modalidade:"PASSAGENS"},
{item:5,valor:1470,data:"2026-01-12",projeto:"GEREB 007 FIO 20",rubrica:"DIÁRIAS",area:"ESCOLA DE GOVERNO FIOCRUZ",descricao:"PARTICIPAR DO II SEMINÁRIO STEM NA SAÚDE",favorecido:"NOELY FABIANA OLIVEIRA DE MOURA",meta:4,modalidade:"DIÁRIAS"},
{item:6,valor:30000,data:"2026-02-02",projeto:"GEREB 012 FIO 25",rubrica:"CLT",area:"NUSMAD",descricao:"CONTRATAÇÃO CLT - VALOR ANUAL BRUTO",favorecido:"LÍSIA HELENA OLIVIERA SALES",meta:1,modalidade:"CLT"},
{item:7,valor:646.3375,data:"2026-02-26",projeto:"GEREB 007 FIO 20",rubrica:"PASSAGENS",area:"NETHIS",descricao:"PARTICIPAÇÃO REUNIÕES GOVERNO ESTADUAL",favorecido:"JOSÉ FRANCISCO NOGUEIRO PARANAGUÁ DE SANTANA",meta:4,modalidade:"PASSAGENS"},
{item:8,valor:1216.6666666666667,data:"2026-02-26",projeto:"GEREB 007 FIO 20",rubrica:"DIÁRIAS",area:"NETHIS",descricao:"PARTICIPAÇÃO REUNIÕES GOVERNO ESTADUAL",favorecido:"JOSÉ FRANCISCO NOGUEIRO PARANAGUÁ DE SANTANA",meta:4,modalidade:"DIÁRIAS"},
{item:9,valor:1676.6,data:"2026-01-21",projeto:"GEREB 007 FIO 20",rubrica:"PASSAGENS",area:"GABINETE",descricao:"PARTICIPAR DE REUNIÕES DE AÇÃO",favorecido:"MARIA FABIANA DAMÁSIO PASSOS",meta:4,modalidade:"PASSAGENS"},
{item:10,valor:237.5,data:"2026-06-21",projeto:"GEREB 007 FIO 20",rubrica:"DIÁRIAS",area:"GABINETE",descricao:"PARTICIPAR DE REUNIÕES DE AÇÃO",favorecido:"MARIA FABIANA DAMÁSIO PASSOS",meta:4,modalidade:"DIÁRIAS"},
{item:11,valor:7185,data:"2026-01-22",projeto:"GEREB 005 FIO 21",rubrica:"SPCD",area:"GABINETE",descricao:"RENOVAÇÃO DE LICENÇA ADOBE - ASCOM",favorecido:"MCR SOFTWARE",meta:5,modalidade:"SPCD"},
{item:12,valor:1104.3125,data:"2026-01-16",projeto:"GEREB 007 FIO 20",rubrica:"PASSAGENS",area:"PSAT",descricao:"PARTICIPAR PLANEJAMENTO RESIDÊNCIA",favorecido:"FRANCILENE MENEZES DOS SANTOS",meta:4,modalidade:"PASSAGENS"},
{item:13,valor:987.5,data:"2026-01-16",projeto:"GEREB 007 FIO 20",rubrica:"DIÁRIAS",area:"PSAT",descricao:"PARTICIPAR PLANEJAMENTO RESIDÊNCIA",favorecido:"FRANCILENE MENEZES DOS SANTOS",meta:4,modalidade:"DIÁRIAS"},
{item:14,valor:480.3875,data:"2026-01-28",projeto:"GEREB 031 FIO 23",rubrica:"PASSAGENS",area:"ESCOLA DE GOVERNO FIOCRUZ",descricao:"PARTICIPAR AULAS ESPECIALIZAÇÃO",favorecido:"FABIANA DA SILVA RODRIGUES FERNANDES",meta:3,modalidade:"PASSAGENS"},
{item:15,valor:800,data:"2026-01-28",projeto:"GEREB 031 FIO 23",rubrica:"DIÁRIAS",area:"ESCOLA DE GOVERNO FIOCRUZ",descricao:"PARTICIPAR AULAS ESPECIALIZAÇÃO",favorecido:"FABIANA DA SILVA RODRIGUES FERNANDES",meta:3,modalidade:"DIÁRIAS"},
{item:16,valor:8312.5,data:"2026-01-29",projeto:"GEREB 013 FIO 21",rubrica:"SPCD",area:"ASCOM",descricao:"SERVIÇOS GRÁFICOS: FOLDERS",favorecido:"IMAGEM GRÁFICA",meta:5,modalidade:"SPCD"},
{item:17,valor:15225,data:"2026-01-30",projeto:"GEREB 009 FIO 24",rubrica:"SPCD",area:"PSAT",descricao:"SERVIÇOS GRÁFICOS LIVRO TERRITÓRIOS SAUDÁVEIS",favorecido:"EDITORA EXPRESSÃO POPULAR LTDA",meta:3,modalidade:"SPCD"},
{item:18,valor:1062.4291666666666,data:"2026-01-28",projeto:"GEREB 007 FIO 20",rubrica:"PASSAGENS",area:"NEVS",descricao:"MINISTRAR DISCIPLINA MESTRADO RONDÔNIA",favorecido:"EDUARDO AUGUSTO FERNANDES NILSON",meta:4,modalidade:"PASSAGENS"},
{item:19,valor:1050,data:"2026-01-28",projeto:"GEREB 007 FIO 20",rubrica:"DIÁRIAS",area:"NEVS",descricao:"MINISTRAR DISCIPLINA MESTRADO",favorecido:"EDUARDO AUGUSTO FERNANDES NILSON",meta:4,modalidade:"DIÁRIAS"},
{item:20,valor:939.9541666666665,data:"2026-01-28",projeto:"GEREB 007 FIO 20",rubrica:"PASSAGENS",area:"NEVS",descricao:"MINISTRAR DISCIPLINA",favorecido:"ANA GRETEL ECHAZU",meta:4,modalidade:"PASSAGENS"},
{item:21,valor:883.3333333333333,data:"2026-01-28",projeto:"GEREB 007 FIO 20",rubrica:"DIÁRIAS",area:"NEVS",descricao:"MINISTRAR DISCIPLINA",favorecido:"ANA GRETEL ECHAZU",meta:4,modalidade:"DIÁRIAS"},
{item:22,valor:939.9541666666665,data:"2026-01-28",projeto:"GEREB 007 FIO 20",rubrica:"PASSAGENS",area:"NEVS",descricao:"MINISTRAR DISCIPLINA",favorecido:"NOELY FABIANA OLIVEIRA DE MOURA",meta:4,modalidade:"PASSAGENS"},
{item:23,valor:883.3333333333333,data:"2026-01-28",projeto:"GEREB 007 FIO 20",rubrica:"DIÁRIAS",area:"NEVS",descricao:"MINISTRAR DISCIPLINA",favorecido:"NOELY FABIANA OLIVEIRA DE MOURA",meta:4,modalidade:"DIÁRIAS"},
{item:24,valor:1789.275,data:"2026-01-30",projeto:"GEREB 018 FIO 23",rubrica:"PASSAGENS",area:"ESCOLA DE GOVERNO FIOCRUZ",descricao:"OFICINA JATOBÁ 60+",favorecido:"MARIA CRISTINA RODRIGUES GUILAM",meta:3,modalidade:"PASSAGENS"},
{item:25,valor:612.5,data:"2026-01-30",projeto:"GEREB 018 FIO 23",rubrica:"DIÁRIAS",area:"ESCOLA DE GOVERNO FIOCRUZ",descricao:"OFICINA JATOBÁ 60+",favorecido:"MARIA CRISTINA RODRIGUES GUILAM",meta:3,modalidade:"DIÁRIAS"},
{item:26,valor:833.3333333333333,data:"2026-01-10",projeto:"GEREB 009 FIO 24",rubrica:"BOLSA",area:"PSAT",descricao:"BOLSA - 01 MÊS",favorecido:"ALAN RAYMISON TAVARES RABELO",meta:3,modalidade:"BOLSA"},
{item:27,valor:2083.3333333333335,data:"2026-01-10",projeto:"GEREB 009 FIO 24",rubrica:"BOLSA",area:"PSAT",descricao:"BOLSA - 01 MÊS",favorecido:"ANDREIA GUSSI DE OLIVEIRA",meta:3,modalidade:"BOLSA"},
{item:28,valor:833.3333333333333,data:"2026-02-03",projeto:"GEREB 009 FIO 24",rubrica:"BOLSA",area:"PSAT",descricao:"BOLSA - 06 MESES",favorecido:"BEATRIZ OLIVEIRA BLACKMAN MACHADO",meta:3,modalidade:"BOLSA"},
{item:29,valor:1666.6666666666665,data:"2026-02-03",projeto:"GEREB 009 FIO 24",rubrica:"BOLSA",area:"PSAT",descricao:"BOLSA - 02 MESES",favorecido:"CAMILA LIMA NOGUEIRA",meta:3,modalidade:"BOLSA"},
{item:30,valor:7062.5,data:"2026-01-26",projeto:"GEREB 031 FIO 23",rubrica:"SPCD",area:"ASCOM",descricao:"SERVIÇOS GRÁFICOS: FOLDERS",favorecido:"IMAGEM GRÁFICA",meta:3,modalidade:"SPCD"},
{item:31,valor:7187.5,data:"2026-01-02",projeto:"GEREB 031 FIO 23",rubrica:"SPCD",area:"ESCOLA DE GOVERNO FIOCRUZ",descricao:"AQUISIÇÃO LICENÇA ADOBE",favorecido:"JR COMERCIO LTDA",meta:3,modalidade:"SPCD"},
{item:32,valor:2065.4166666666665,data:"2026-03-02",projeto:"GEREB 031 FIO 23",rubrica:"SPCD",area:"ESCOLA DE GOVERNO FIOCRUZ",descricao:"KIT TECLADO E MOUSE",favorecido:"JR COMERCIO LTDA",meta:3,modalidade:"SPCD"},
{item:33,valor:4083.333333333333,data:"2026-02-10",projeto:"GEREB 031 FIO 23",rubrica:"SPCD",area:"ESCOLA DE GOVERNO FIOCRUZ",descricao:"EVENTO COLETIVO JATOBÁ 60+",favorecido:"IARA MARIA MAXIMO NOGUEIRA ME",meta:3,modalidade:"SPCD"},
{item:34,valor:2173.054166666667,data:"2026-02-08",projeto:"GEREB 014 FIO 24",rubrica:"PASSAGENS",area:"GABINETE",descricao:"REUNIÃO PRESIDÊNCIA",favorecido:"MARIA FABIANA DAMÁSIO PASSOS",meta:1,modalidade:"PASSAGENS"},
{item:35,valor:237.5,data:"2026-02-08",projeto:"GEREB 014 FIO 24",rubrica:"DIÁRIAS",area:"GABINETE",descricao:"REUNIÃO PRESIDÊNCIA",favorecido:"MARIA FABIANA DAMÁSIO PASSOS",meta:1,modalidade:"DIÁRIAS"},
{item:36,valor:933.3875,data:"2026-02-10",projeto:"GEREB 013 FIO 21",rubrica:"PASSAGENS",area:"CPP",descricao:"FÓRUM OSWALDO CRUZ",favorecido:"MARCIA DA LUZ MOTA",meta:5,modalidade:"PASSAGENS"},
{item:37,valor:425,data:"2026-02-10",projeto:"GEREB 013 FIO 21",rubrica:"DIÁRIAS",area:"CPP",descricao:"FÓRUM OSWALDO CRUZ",favorecido:"MARCIA DA LUZ MOTA",meta:5,modalidade:"DIÁRIAS"},
{item:38,valor:933.3875,data:"2026-02-10",projeto:"GEREB 013 FIO 21",rubrica:"PASSAGENS",area:"CPP",descricao:"FÓRUM OSWALDO CRUZ",favorecido:"MARGE TENORIO",meta:5,modalidade:"PASSAGENS"},
{item:39,valor:425,data:"2026-02-10",projeto:"GEREB 013 FIO 21",rubrica:"DIÁRIAS",area:"PEPTS",descricao:"FÓRUM OSWALDO CRUZ",favorecido:"MARGE TENORIO",meta:5,modalidade:"DIÁRIAS"},
{item:40,valor:933.3875,data:"2026-02-10",projeto:"GEREB 013 FIO 21",rubrica:"PASSAGENS",area:"CPP",descricao:"FÓRUM OSWALDO CRUZ",favorecido:"ANA GRETEL ECHAZU",meta:5,modalidade:"PASSAGENS"},
{item:41,valor:425,data:"2026-02-10",projeto:"GEREB 013 FIO 21",rubrica:"DIÁRIAS",area:"CPP",descricao:"FÓRUM OSWALDO CRUZ",favorecido:"ANA GRETEL ECHAZU",meta:5,modalidade:"DIÁRIAS"},
{item:42,valor:933.3875,data:"2026-02-10",projeto:"GEREB 013 FIO 21",rubrica:"PASSAGENS",area:"PEPTS",descricao:"FÓRUM OSWALDO CRUZ",favorecido:"FLÁVIA TAVARES SILVA ELIAS",meta:5,modalidade:"PASSAGENS"},
{item:43,valor:425,data:"2026-02-10",projeto:"GEREB 013 FIO 21",rubrica:"DIÁRIAS",area:"PEPTS",descricao:"FÓRUM OSWALDO CRUZ",favorecido:"FLÁVIA TAVARES SILVA ELIAS",meta:5,modalidade:"DIÁRIAS"},
{item:44,valor:933.3875,data:"2026-02-10",projeto:"GEREB 013 FIO 21",rubrica:"PASSAGENS",area:"GABINETE",descricao:"FÓRUM OSWALDO CRUZ",favorecido:"ALEXANDRO RODRIGUES PINTO",meta:5,modalidade:"PASSAGENS"},
{item:45,valor:425,data:"2026-02-10",projeto:"GEREB 013 FIO 21",rubrica:"DIÁRIAS",area:"GABINETE",descricao:"FÓRUM OSWALDO CRUZ",favorecido:"ALEXANDRO RODRIGUES PINTO",meta:5,modalidade:"DIÁRIAS"},
{item:46,valor:933.3875,data:"2026-02-10",projeto:"GEREB 013 FIO 21",rubrica:"PASSAGENS",area:"CPP",descricao:"FÓRUM OSWALDO CRUZ",favorecido:"JOÃO VITOR DA SILVA SANTOS",meta:5,modalidade:"PASSAGENS"},
{item:47,valor:425,data:"2026-02-10",projeto:"GEREB 013 FIO 21",rubrica:"DIÁRIAS",area:"CPP",descricao:"FÓRUM OSWALDO CRUZ",favorecido:"JOÃO VITOR DA SILVA SANTOS",meta:5,modalidade:"DIÁRIAS"},
{item:48,valor:651.1541666666666,data:"2026-02-10",projeto:"GEREB 013 FIO 21",rubrica:"PASSAGENS",area:"CPP",descricao:"FÓRUM OSWALDO CRUZ",favorecido:"LUCIANA GUERRA GALLO",meta:5,modalidade:"PASSAGENS"},
{item:49,valor:425,data:"2026-02-10",projeto:"GEREB 013 FIO 21",rubrica:"DIÁRIAS",area:"CPP",descricao:"FÓRUM OSWALDO CRUZ",favorecido:"LUCIANA GUERRA GALLO",meta:5,modalidade:"DIÁRIAS"},
{item:50,valor:1461.7208333333335,data:"2026-02-12",projeto:"GEREB 007 FIO 20",rubrica:"PASSAGENS",area:"GABINETE",descricao:"REUNIÃO PRESIDÊNCIA",favorecido:"MARIA FABIANA DAMÁSIO PASSOS",meta:4,modalidade:"PASSAGENS"},
{item:51,valor:237.5,data:"2026-02-12",projeto:"GEREB 007 FIO 20",rubrica:"DIÁRIAS",area:"GABINETE",descricao:"REUNIÃO PRESIDÊNCIA",favorecido:"MARIA FABIANA DAMÁSIO PASSOS",meta:4,modalidade:"DIÁRIAS"},
{item:52,valor:4166.666666666667,data:"2026-02-13",projeto:"GEREB 009 FIO 24",rubrica:"BOLSA",area:"PSAT",descricao:"BOLSA - 03 MESES",favorecido:"CECILIA CUNHA FRANCO FERREIRA VILAS BOAS",meta:3,modalidade:"BOLSA"},
{item:53,valor:6666.666666666666,data:"2026-02-13",projeto:"GEREB 009 FIO 24",rubrica:"BOLSA",area:"PSAT",descricao:"BOLSA - 03 MESES",favorecido:"WAGNER ELIAS PINHEIRO DOS SANTOS",meta:3,modalidade:"BOLSA"},
{item:54,valor:1183.3333333333333,data:"2026-02-13",projeto:"GEREB 009 FIO 24",rubrica:"BOLSA",area:"PSAT",descricao:"BOLSA - 02 MESES",favorecido:"FERNANDA KNIERIM CORREA",meta:3,modalidade:"BOLSA"},
{item:55,valor:2500,data:"2026-02-13",projeto:"GEREB 009 FIO 24",rubrica:"BOLSA",area:"PSAT",descricao:"BOLSA - 03 MESES",favorecido:"FRANCILENE MENEZES DOS SANTOS",meta:3,modalidade:"BOLSA"},
{item:56,valor:71256.5,data:"2026-03-18",projeto:"GEREB 033 FIO 23",rubrica:"CLT",area:"NUGP",descricao:"CONTRATAÇÃO CLT - GEANE MONTENEGRO",favorecido:"GEANE DI MAGIELLI FIGUEIRO DA SILVA MONTENEGRO",meta:7,modalidade:"CLT"},
{item:57,valor:1212.0541666666666,data:"2026-02-20",projeto:"GEREB 007 FIO 20",rubrica:"PASSAGENS",area:"ASCOM",descricao:"FÓRUM DE ASSESSORES",favorecido:"FABIANA MASCARENHAS SANT'ANA",meta:4,modalidade:"PASSAGENS"},
{item:58,valor:237.5,data:"2026-02-20",projeto:"GEREB 007 FIO 20",rubrica:"DIÁRIAS",area:"ASCOM",descricao:"FÓRUM DE ASSESSORES",favorecido:"FABIANA MASCARENHAS SANT'ANA",meta:4,modalidade:"DIÁRIAS"},
{item:59,valor:1536.9416666666666,data:"2026-02-20",projeto:"GEREB 007 FIO 20",rubrica:"PASSAGENS",area:"PSAT",descricao:"MINISTRAR AULA RESIDÊNCIA",favorecido:"FRANCILENE MENEZES DOS SANTOS",meta:4,modalidade:"PASSAGENS"},
{item:60,valor:2487.5,data:"2026-02-20",projeto:"GEREB 007 FIO 20",rubrica:"DIÁRIAS",area:"PSAT",descricao:"MINISTRAR AULA RESIDÊNCIA",favorecido:"FRANCILENE MENEZES DOS SANTOS",meta:4,modalidade:"DIÁRIAS"},
{item:61,valor:735.375,data:"2026-02-20",projeto:"GEREB 007 FIO 20",rubrica:"PASSAGENS",area:"PSAT",descricao:"MINISTRAR AULA",favorecido:"MAURICÉIA MARIA DE SANTANA",meta:4,modalidade:"PASSAGENS"},
{item:62,valor:800,data:"2026-02-20",projeto:"GEREB 007 FIO 20",rubrica:"DIÁRIAS",area:"PSAT",descricao:"MINISTRAR AULA",favorecido:"MAURICÉIA MARIA DE SANTANA",meta:4,modalidade:"DIÁRIAS"},
{item:63,valor:22083.333333333336,data:"2026-03-04",projeto:"GEREB 009 FIO 24",rubrica:"BOLSA",area:"PSAT",descricao:"BOLSA - 06 MESES",favorecido:"MATEUS DOS SANTOS BRITO",meta:3,modalidade:"BOLSA"},
{item:64,valor:5833.333333333334,data:"2026-03-03",projeto:"GEREB 009 FIO 24",rubrica:"BOLSA",area:"PSAT",descricao:"BOLSA - 02 MESES",favorecido:"PAMELA ARRUDA VASCONCELLOS",meta:3,modalidade:"BOLSA"},
{item:65,valor:10833.333333333332,data:"2026-03-06",projeto:"GEREB 007 FIO 20",rubrica:"SPCD",area:"ESCOLA DE GOVERNO FIOCRUZ",descricao:"ALIMENTAÇÃO EVENTO",favorecido:"IARA MARIA MAXIMO NOGUEIRA ME",meta:4,modalidade:"SPCD"},
{item:66,valor:687.5,data:"2026-03-09",projeto:"GEREB 007 FIO 20",rubrica:"SPCD",area:"ESCOLA DE GOVERNO FIOCRUZ",descricao:"SERVIÇOS GRÁFICOS AULA MAGNA",favorecido:"FERNANDO CAMARGOS DA SILVA",meta:4,modalidade:"SPCD"},
{item:67,valor:5737.5,data:"2026-03-02",projeto:"GEREB 031 FIO 23",rubrica:"SPCD",area:"GABINETE",descricao:"CALENDÁRIOS 2026",favorecido:"IMAGEM GRÁFICA",meta:3,modalidade:"SPCD"},
{item:68,valor:1149.7208333333333,data:"2026-02-26",projeto:"GEREB 007 FIO 20",rubrica:"PASSAGENS",area:"GABINETE",descricao:"PART. FÓRUM OSWALDO CRUZ",favorecido:"MARIA FABIANA DAMÁSIO PASSOS",meta:4,modalidade:"PASSAGENS"},
{item:69,valor:237.5,data:"2026-02-26",projeto:"GEREB 007 FIO 20",rubrica:"DIÁRIAS",area:"GABINETE",descricao:"PART. FÓRUM OSWALDO CRUZ",favorecido:"MARIA FABIANA DAMÁSIO PASSOS",meta:4,modalidade:"DIÁRIAS"},
{item:70,valor:1080.825,data:"2026-03-06",projeto:"GEREB 007 FIO 20",rubrica:"PASSAGENS",area:"ESCOLA DE GOVERNO FIOCRUZ",descricao:"AULA INAUGURAL FIOCRUZ",favorecido:"LUCIANA SEPULVEDA KOPTCKE",meta:4,modalidade:"PASSAGENS"},
{item:71,valor:237.5,data:"2026-03-06",projeto:"GEREB 007 FIO 20",rubrica:"DIÁRIAS",area:"ESCOLA DE GOVERNO FIOCRUZ",descricao:"AULA INAUGURAL",favorecido:"LUCIANA SEPULVEDA KOPTCKE",meta:4,modalidade:"DIÁRIAS"},
{item:72,valor:2083.3333333333335,data:"2026-03-17",projeto:"GEREB 009 FIO 24",rubrica:"BOLSA",area:"PSAT",descricao:"BOLSA - 03 MESES",favorecido:"PEDRO HENRIQUE SANTOS VITORIANO",meta:3,modalidade:"BOLSA"},
{item:73,valor:46896.05,data:"2026-03-18",projeto:"GEREB 008 FIO 25",rubrica:"CLT",area:"NEAD",descricao:"CONTRATAÇÃO CLT ALEXANDRA JAPIASSU",favorecido:"ALEXANDRA GALVAO DE OLIVEIRA JAPIASSU",meta:12,modalidade:"CLT"},
{item:74,valor:124486.9,data:"2026-03-18",projeto:"GEREB 008 FIO 25",rubrica:"CLT",area:"UNASUS",descricao:"CONTRATAÇÃO CLT ALYSSON LEMOS",favorecido:"ALYSSON FELICIANO LEMOS",meta:12,modalidade:"CLT"},
{item:75,valor:20828.8,data:"2026-03-18",projeto:"GEREB 008 FIO 25",rubrica:"CLT",area:"UNASUS",descricao:"CONTRATAÇÃO CLT BRUNO LUCENA",favorecido:"BRUNO EDUARDO LUCENA DOS SANTOS",meta:12,modalidade:"CLT"},
{item:76,valor:32887.6,data:"2026-03-18",projeto:"GEREB 008 FIO 25",rubrica:"CLT",area:"NUGP",descricao:"CONTRATAÇÃO CLT ERIKA VASCONCELOS",favorecido:"ERIKA DE SA VASCONCELOS",meta:12,modalidade:"CLT"},
{item:77,valor:56495.85,data:"2026-03-18",projeto:"GEREB 008 FIO 25",rubrica:"CLT",area:"UNASUS",descricao:"CONTRATAÇÃO CLT CAROLINA ALVARES",favorecido:"CAROLINA CARDOSO ALVARES",meta:12,modalidade:"CLT"},
{item:78,valor:51775,data:"2026-03-18",projeto:"GEREB 008 FIO 25",rubrica:"CLT",area:"UNASUS",descricao:"CONTRATAÇÃO CLT CLAUDIA CORREA",favorecido:"CLAUDIA LOPES CORREA",meta:12,modalidade:"CLT"},
{item:79,valor:41110.65,data:"2026-03-18",projeto:"GEREB 008 FIO 25",rubrica:"CLT",area:"NUGP",descricao:"CONTRATAÇÃO CLT DENIS COSTA",favorecido:"DENIS HENRIQUE COSTA",meta:12,modalidade:"CLT"},
{item:80,valor:47290.5,data:"2026-03-18",projeto:"GEREB 008 FIO 25",rubrica:"CLT",area:"UNASUS",descricao:"CONTRATAÇÃO CLT GIANNI LAROCCA",favorecido:"GIANNI REINALDI LAROCCA",meta:12,modalidade:"CLT"},
{item:81,valor:42774.2,data:"2026-03-18",projeto:"GEREB 008 FIO 25",rubrica:"CLT",area:"UNASUS",descricao:"CONTRATAÇÃO CLT ILMA SANTOS",favorecido:"ILMA FRANCISCA SANTOS",meta:12,modalidade:"CLT"},
{item:82,valor:59727.3,data:"2026-03-18",projeto:"GEREB 008 FIO 25",rubrica:"CLT",area:"GABINETE",descricao:"CONTRATAÇÃO CLT JULIANA STEIMBACK",favorecido:"JULIANA GOMES DOS SANTOS STEIMBACK",meta:12,modalidade:"CLT"},
{item:83,valor:31881.35,data:"2026-03-18",projeto:"GEREB 008 FIO 25",rubrica:"CLT",area:"UNASUS",descricao:"CONTRATAÇÃO CLT KARLA SOUSA",favorecido:"KARLA MARIA PEREIRA SOUSA",meta:12,modalidade:"CLT"},
{item:84,valor:20828.8,data:"2026-03-18",projeto:"GEREB 008 FIO 25",rubrica:"CLT",area:"GESTÃO",descricao:"CONTRATAÇÃO CLT KLEBER CAVALCANTE",favorecido:"KLEBER PASSOS CAVALCANTE",meta:12,modalidade:"CLT"},
{item:85,valor:47115.75,data:"2026-03-18",projeto:"GEREB 008 FIO 25",rubrica:"CLT",area:"GESTÃO",descricao:"CONTRATAÇÃO CLT LEONARDO PAULA",favorecido:"LEONARDO DOS SANTOS DE PAULA",meta:12,modalidade:"CLT"},
{item:86,valor:47290.5,data:"2026-03-18",projeto:"GEREB 008 FIO 25",rubrica:"CLT",area:"UNASUS",descricao:"CONTRATAÇÃO CLT MARIA DAMASCENO",favorecido:"MARIA DAS GRACAS BARROSO DAMASCENO",meta:12,modalidade:"CLT"},
{item:87,valor:59727.3,data:"2026-03-18",projeto:"GEREB 008 FIO 25",rubrica:"CLT",area:"GABINETE",descricao:"CONTRATAÇÃO CLT MEIRILUCI LIMA",favorecido:"MEIRILUCI ALVES LIMA",meta:12,modalidade:"CLT"},
{item:88,valor:62504.6,data:"2026-03-18",projeto:"GEREB 008 FIO 25",rubrica:"CLT",area:"NUGP",descricao:"CONTRATAÇÃO CLT PAULO CUGULA",favorecido:"PAULO ROBERTO CUGULA",meta:12,modalidade:"CLT"},
{item:89,valor:32887.6,data:"2026-03-18",projeto:"GEREB 008 FIO 25",rubrica:"CLT",area:"UNASUS",descricao:"CONTRATAÇÃO CLT POLLYANA PEREIRA",favorecido:"POLLYANA DOS SANTOS PEREIRA",meta:12,modalidade:"CLT"},
{item:90,valor:83536.7,data:"2026-03-18",projeto:"GEREB 008 FIO 25",rubrica:"CLT",area:"UNASUS",descricao:"CONTRATAÇÃO CLT RAFAEL MONTEIRO",favorecido:"RAFAEL DE MEDEIROS MONTEIRO",meta:12,modalidade:"CLT"},
{item:91,valor:40013.25,data:"2026-03-18",projeto:"GEREB 008 FIO 25",rubrica:"CLT",area:"ASCOM",descricao:"CONTRATAÇÃO CLT SERGIO VELHO JR",favorecido:"SERGIO VELHO DA SILVA JUNIOR",meta:12,modalidade:"CLT"},
{item:92,valor:59727.3,data:"2026-03-18",projeto:"GEREB 008 FIO 25",rubrica:"CLT",area:"UNASUS",descricao:"CONTRATAÇÃO CLT SUSANA BELICH",favorecido:"SUSANA DAMASCENO BELICH",meta:12,modalidade:"CLT"},
{item:93,valor:80144.75,data:"2026-03-18",projeto:"GEREB 008 FIO 25",rubrica:"CLT",area:"UNASUS",descricao:"CONTRATAÇÃO CLT SUZANA FRANCO",favorecido:"SUZANA MELO FRANCO",meta:12,modalidade:"CLT"},
{item:94,valor:47115.75,data:"2026-03-18",projeto:"GEREB 008 FIO 25",rubrica:"CLT",area:"AJUR",descricao:"CONTRATAÇÃO CLT THIAGO LIMA",favorecido:"THIAGO FIGUEIREDO DE LIMA",meta:12,modalidade:"CLT"},
{item:95,valor:44583.05,data:"2026-03-18",projeto:"GEREB 008 FIO 25",rubrica:"CLT",area:"NEAD",descricao:"CONTRATAÇÃO CLT VANDO PINTO",favorecido:"VANDO CARVALHO RODRIGUES PINTO",meta:12,modalidade:"CLT"},
{item:96,valor:43021.15,data:"2026-03-18",projeto:"GEREB 023 FIO 23",rubrica:"CLT",area:"NUGP",descricao:"CONTRATAÇÃO CLT ELAINE ROCHA",favorecido:"ELAINE RIBEIRO ROCHA",meta:8,modalidade:"CLT"},
{item:97,valor:46682.65,data:"2026-03-18",projeto:"GEREB 033 FIO 23",rubrica:"CLT",area:"NUGP",descricao:"CONTRATAÇÃO CLT ARIEDNA JESUS",favorecido:"ARIEDNA AZEVEDO DE JESUS",meta:7,modalidade:"CLT"},
{item:98,valor:44843.5,data:"2026-03-18",projeto:"GEREB 033 FIO 23",rubrica:"CLT",area:"NUGP",descricao:"CONTRATAÇÃO CLT ARTHUR LIMA",favorecido:"ARTHUR VIEIRA DE LIMA",meta:7,modalidade:"CLT"},
{item:99,valor:32887.6,data:"2026-03-18",projeto:"GEREB 033 FIO 23",rubrica:"CLT",area:"NUGP",descricao:"CONTRATAÇÃO CLT CAMILA SALGADO",favorecido:"CAMILA LIMA SALGADO DOS SANTOS",meta:7,modalidade:"CLT"},
{item:100,valor:71256.5,data:"2026-03-18",projeto:"GEREB 033 FIO 23",rubrica:"CLT",area:"NUGP",descricao:"CONTRATAÇÃO CLT CRISTIANO COSTA",favorecido:"CRISTIANO GOMES DA COSTA",meta:7,modalidade:"CLT"},
{item:101,valor:52212.6,data:"2026-03-18",projeto:"GEREB 033 FIO 23",rubrica:"CLT",area:"NUGP",descricao:"CONTRATAÇÃO CLT ROSANGELA RIBEIRO",favorecido:"ROSANGELA COSTA RIBEIRO",meta:7,modalidade:"CLT"},
{item:102,valor:25760.1,data:"2026-03-18",projeto:"GEREB 014 FIO 24",rubrica:"CLT",area:"NUSMAD",descricao:"CONTRATAÇÃO CLT CAMILA SELESTINO",favorecido:"CAMILA LINO SELESTINO DA SILVA",meta:10,modalidade:"CLT"},
{item:103,valor:1500,data:"2026-03-23",projeto:"GEREB 009 FIO 24",rubrica:"BOLSA",area:"PSAT",descricao:"BOLSA - 1 MÊS",favorecido:"THAIARA DORNELLES LAGO",meta:3,modalidade:"BOLSA"},
{item:104,valor:1050,data:"2026-03-30",projeto:"GEREB 009 FIO 24",rubrica:"SPCD",area:"PSAT",descricao:"PLANEJAMENTO PEDAGÓGICO",favorecido:"RUBENS MALAQUIAS",meta:3,modalidade:"SPCD"},
{item:105,valor:4926.87,data:"2026-03-23",projeto:"GEREB 031 FIO 23",rubrica:"PASSAGENS",area:"NETHIS",descricao:"LANÇAMENTO COALIZAÇÃO",favorecido:"ROBERTA DE FREITAS CAMPOS",meta:3,modalidade:"PASSAGENS"},
{item:106,valor:570,data:"2026-03-23",projeto:"GEREB 031 FIO 23",rubrica:"DIÁRIAS",area:"NETHIS",descricao:"LANÇAMENTO COALIZAÇÃO",favorecido:"ROBERTA DE FREITAS CAMPOS",meta:3,modalidade:"DIÁRIAS"},
{item:107,valor:4883.88,data:"2026-03-30",projeto:"GEREB 007 FIO 20",rubrica:"PASSAGENS",area:"ASCOM",descricao:"OFICINA OBSMA",favorecido:"ADRIELLY MONIQUE REGO REIS",meta:4,modalidade:"PASSAGENS"},
{item:108,valor:1170,data:"2026-03-30",projeto:"GEREB 007 FIO 20",rubrica:"DIÁRIAS",area:"ASCOM",descricao:"OFICINA OBSMA",favorecido:"ADRIELLY MONIQUE REGO REIS",meta:4,modalidade:"DIÁRIAS"},
{item:109,valor:4883.88,data:"2026-03-30",projeto:"GEREB 007 FIO 20",rubrica:"PASSAGENS",area:"ASCOM",descricao:"OFICINA OBSMA",favorecido:"GIOVANNA BRUNA RODRIGUES MARTINS",meta:4,modalidade:"PASSAGENS"},
{item:110,valor:11170,data:"2026-03-30",projeto:"GEREB 007 FIO 20",rubrica:"DIÁRIAS",area:"ASCOM",descricao:"OFICINA OBSMA",favorecido:"GIOVANNA BRUNA RODRIGUES MARTINS",meta:4,modalidade:"DIÁRIAS"},
{item:111,valor:4883.88,data:"2026-03-30",projeto:"GEREB 007 FIO 20",rubrica:"PASSAGENS",area:"ASCOM",descricao:"OFICINA OBSMA",favorecido:"FERNANDO DA SILVA PINTO",meta:4,modalidade:"PASSAGENS"},
{item:112,valor:1170,data:"2026-03-30",projeto:"GEREB 007 FIO 20",rubrica:"DIÁRIAS",area:"ASCOM",descricao:"OFICINA OBSMA",favorecido:"FERNANDO DA SILVA PINTO",meta:4,modalidade:"DIÁRIAS"},
{item:113,valor:4883.88,data:"2026-03-30",projeto:"GEREB 007 FIO 20",rubrica:"PASSAGENS",area:"ESCOLA DE GOVERNO FIOCRUZ",descricao:"OFICINA OBSMA",favorecido:"DOUGLAS FERNANDES DA SILVA",meta:4,modalidade:"PASSAGENS"},
{item:114,valor:1170,data:"2026-03-30",projeto:"GEREB 007 FIO 20",rubrica:"DIÁRIAS",area:"ESCOLA DE GOVERNO FIOCRUZ",descricao:"OFICINA OBSMA",favorecido:"DOUGLAS FERNANDES DA SILVA",meta:4,modalidade:"DIÁRIAS"},
{item:115,valor:7620,data:"2026-04-09",projeto:"GEREB 007 FIO 20",rubrica:"SPCD",area:"ASCOM",descricao:"MATERIAL GRÁFICO SEMANA GESTÃO",favorecido:"POSITIVA",meta:4,modalidade:"SPCD"},
{item:116,valor:8928,data:"2026-04-09",projeto:"GEREB 007 FIO 20",rubrica:"SPCD",area:"ASCOM",descricao:"MATERIAL GRÁFICO SEMANA GESTÃO",favorecido:"POSITIVA",meta:4,modalidade:"SPCD"},
{item:117,valor:3297,data:"2026-04-09",projeto:"GEREB 031 FIO 23",rubrica:"SPCD",area:"ASCOM",descricao:"MATERIAL GRÁFICO",favorecido:"POSITIVA",meta:3,modalidade:"SPCD"},
{item:118,valor:533.76,data:"2026-04-14",projeto:"GEREB 023 FIO 23",rubrica:"REEMBOLSO",area:"ASCOM",descricao:"RENOVAÇÃO LICENÇA FLICKR",favorecido:"FLICKR.COM",meta:2,modalidade:"REEMBOLSO"},
{item:119,valor:2000,data:"2026-04-14",projeto:"GEREB 007 FIO 20",rubrica:"SPCD",area:"GESTÃO",descricao:"AQUISIÇÃO DE LIVROS",favorecido:"HY PRODUÇÕES E EVENTOS",meta:4,modalidade:"SPCD"},
{item:120,valor:2000,data:"2026-02-20",projeto:"GEREB 009 FIO 24",rubrica:"BOLSA",area:"PSAT",descricao:"BOLSA - 1 MÊS",favorecido:"VINICIUS VIERA DA SILVA",meta:3,modalidade:"BOLSA"},
{item:121,valor:53900,data:"2026-04-23",projeto:"GEREB 009 FIO 24",rubrica:"BOLSA",area:"PSAT",descricao:"BOLSA - 07 MESES",favorecido:"FATIMA CRISTINA CUNHA MAIA SILVA",meta:3,modalidade:"BOLSA"},
{item:122,valor:4487.13,data:"2026-04-16",projeto:"GEREB 001 FIO 24",rubrica:"PASSAGENS",area:"GABINETE",descricao:"REUNIÃO PRESIDÊNCIA CANAL SAÚDE",favorecido:"MARIA FABIANA DAMÁSIO PASSOS",meta:3,modalidade:"PASSAGENS"},
{item:123,valor:570,data:"2026-04-16",projeto:"GEREB 001 FIO 24",rubrica:"DIÁRIAS",area:"GABINETE",descricao:"REUNIÃO PRESIDÊNCIA",favorecido:"MARIA FABIANA DAMÁSIO PASSOS",meta:3,modalidade:"DIÁRIAS"},
{item:124,valor:3312.27,data:"2026-04-16",projeto:"GEREB 001 FIO 24",rubrica:"PASSAGENS",area:"ASCOM",descricao:"ASSESSORAR DIRETORA",favorecido:"FABIANA MASCARENHAS SANTANA",meta:3,modalidade:"PASSAGENS"},
{item:125,valor:570,data:"2026-04-16",projeto:"GEREB 001 FIO 24",rubrica:"DIÁRIAS",area:"ASCOM",descricao:"ASSESSORAR DIRETORA",favorecido:"FABIANA MASCARENHAS SANTANA",meta:3,modalidade:"DIÁRIAS"},
{item:126,valor:1800.82,data:"2026-04-15",projeto:"GEREB 018 FIO 23",rubrica:"PASSAGENS",area:"GESTÃO",descricao:"SEMANA DE GESTÃO",favorecido:"ROGÉRIO SENA CORADO",meta:3,modalidade:"PASSAGENS"},
{item:127,valor:146000,data:"2026-01-02",projeto:"GEREB 014 FIO 25",rubrica:"BOLSA",area:"NUSMAD",descricao:"BOLSA - 10 MESES",favorecido:"FERNANDA MARIA DUARTE SEVERO",meta:5,modalidade:"BOLSA"},
{item:128,valor:57600,data:"2026-01-02",projeto:"GEREB 018 FIO 23",rubrica:"BOLSA",area:"NUSMAD",descricao:"BOLSA - 06 MESES",favorecido:"JAQUELINE TAVARES DE ASSIS",meta:3,modalidade:"BOLSA"},
{item:129,valor:27000,data:"2026-01-02",projeto:"GEREB 018 FIO 23",rubrica:"BOLSA",area:"NUSMAD",descricao:"BOLSA - 06 MESES",favorecido:"KARINA APARECIDA FIGUEIREDO",meta:3,modalidade:"BOLSA"}
];

// ============================================
// PROJETOS (28 REGISTROS)
// ============================================
const projetos = [
{id:"GEREB-013-FIO-21",numInstrumento:"52/2021",nome:"GESTÃO ESTRATÉGICA PARA ACESSO E QUALIDADE DA ASSISTÊNCIA FARMACÊUTICA NO SUS.",valorTotal:55407026,coordenador:"DANIELLA CRISTINA RODRIGUES PEREIRA",secretarias:"DAF/SCTIE/MS",objeto:"GESTÃO ESTRATÉGICA PARA ACESSO E QUALIDADE DA ASSISTÊNCIA FARMACÊUTICA.",inicio:"2021-12-10",fim:"2025-12-10",saldoDI:0,saldoGeral:-2457850.79},
{id:"GEREB-035-FIO-23",numInstrumento:"79/2023",nome:"CAPACITAÇÃO EM VIGILÂNCIA, PREVENÇÃO E CONTROLE DE ZOONOSES",valorTotal:3000000,coordenador:"KELLEN CRISTINA DA SILVA GASQUE",secretarias:"Secretaria de Vigilância em Saúde e Ambiente - SVSA/MS",objeto:"Capacitação em vigilância, prevenção e controle de zoonoses",inicio:"2023-12-22",fim:"2025-12-22",saldoDI:365263.06,saldoGeral:1619158.39},
{id:"GEREB-055-FIO-24",numInstrumento:"21/2024",nome:"AÇÕES DE PROMOÇÃO DA POLÍTICA NACIONAL DE EDUCAÇÃO POPULAR EM SAÚDE NO SUS",valorTotal:7000000,coordenador:"OSVALDO PERALTA BONETTI",secretarias:"Coordenação-Geral de Articulação Interfederativa e Participativa (CGAIP)",objeto:"Promoção da Política Nacional de Educação Popular em Saúde",inicio:"2024-08-20",fim:"2026-08-20",saldoDI:31893.12,saldoGeral:669755.44},
{id:"GEREB-010-FIO-24",numInstrumento:"137/2023",nome:"FORMAÇÃO EM POLÍTICAS PÚBLICAS DE SAÚDE NA ÁREA DE AVALIAÇÃO DE TECNOLOGIAS EM SAÚDE",valorTotal:2461725,coordenador:"FLÁVIA TAVARES SILVA ELIAS",secretarias:"Secretaria de Inovação e Saúde Digital - SEIDIGI/MS",objeto:"Formação em Avaliação de Tecnologias em Saúde",inicio:"2024-01-12",fim:"2026-07-12",saldoDI:69117.39,saldoGeral:1371932.26},
{id:"GEREB-033-FIO-23",numInstrumento:"55/2023",nome:"DESENVOLVIMENTO DE AÇÕES ESTRATÉGICAS DE PREPARAÇÃO E RESPOSTA ÀS EMERGÊNCIAS EM SAÚDE PÚBLICA",valorTotal:40991199,coordenador:"MÁRCIO ALDRIN FRANÇA CAVALCANTE",secretarias:"Secretaria de Vigilância em Saúde e Ambiente - SVSA/MS",objeto:"Preparação e resposta a emergências em saúde pública",inicio:"2023-12-21",fim:"2028-12-21",saldoDI:0,saldoGeral:-153274.19},
{id:"GEREB-029-FIO-23",numInstrumento:"39/2023",nome:"INTELIGÊNCIA ESTRATÉGICA NA TRANSFORMAÇÃO DIGITAL EM SAÚDE",valorTotal:5000000,coordenador:"WAGNER DE JESUS MARTINS",secretarias:"Departamento de Monitoramento e disseminação de informações - Seidigi/MS",objeto:"Inteligência estratégica para transformação digital em saúde",inicio:"2023-12-14",fim:"2027-12-14",saldoDI:11912.61,saldoGeral:250165.68},
{id:"GEREB-005-FIO-25",numInstrumento:"137/2024",nome:"PERIFERIA SAUDÁVEL, SUSTENTÁVEL E SOLIDÁRIA",valorTotal:50000000,coordenador:"WAGNER DE JESUS MARTINS",secretarias:"Secretária Executiva – SE",objeto:"Desenvolvimento territorial solidário e sustentável em periferias",inicio:"2025-01-06",fim:"2028-01-06",saldoDI:7394.06,saldoGeral:155701.23},
{id:"GEREB-061-FIO-24",numInstrumento:"55/2024",nome:"ESTUDO PARA ATUALIZAÇÃO DA POLÍTICA NACIONAL DE ATENÇÃO INTEGRAL DA SAÚDE DA MULHER",valorTotal:4024057,coordenador:"ANA CONCEIÇÃO RIBEIRO DANTAS SATURNINO",secretarias:"Secretária de Atenção Primária à Saúde - SAPS",objeto:"Atualização da PNAISM",inicio:"2024-12-11",fim:"2026-04-11",saldoDI:1851.13,saldoGeral:40325.44},
{id:"GEREB-022-FIO-20",numInstrumento:"109/2020",nome:"EDUCAÇÃO PARA O DESENVOLVIMENTO DOS SERVIDORES PÚBLICOS FEDERAIS DO MINISTÉRIO DA SAÚDE",valorTotal:4291963,coordenador:"LUCIANA SEPÚLVEDA KOPTCKE",secretarias:"Subsecretaria de Assuntos Administravos - COGEP - DIEDEP",objeto:"Capacitação de servidores públicos federais",inicio:"2020-12-29",fim:"2025-12-01",saldoDI:5759.33,saldoGeral:151182.33},
{id:"GEREB-013-FIO-24",numInstrumento:"142/2023",nome:"FORTALECIMENTO DO ACESSO A PLANTAS MEDICINAIS E FITOTERÁPICOS NO SUS",valorTotal:9000000,coordenador:"WAGNER DE JESUS MARTINS",secretarias:"DAF/SCTIE/MS",objeto:"Fortalecimento da Política Nacional de Plantas Medicinais",inicio:"2024-01-24",fim:"2028-01-24",saldoDI:7491.84,saldoGeral:157328.56},
{id:"GEREB-021-FIO-23",numInstrumento:"010/2023",nome:"FORTALECIMENTO DO PROGRAMA DE TREINAMENTO EM EPIDEMIOLOGIA APLICADA AOS SERVIÇOS DO SUS",valorTotal:4500000,coordenador:"NOELY FABIANA OLIVEIRA DE MOURA",secretarias:"Secretaria de Vigilância em Saúde e Ambiente - SVSA",objeto:"Treinamento em epidemiologia aplicada",inicio:"2023-11-29",fim:"2027-11-29",saldoDI:111877.2,saldoGeral:2349421.22},
{id:"GEREB-023-FIO-23",numInstrumento:"37/2023",nome:"IMPLEMENTAÇÃO DE MODELO DE GOVERNANÇA E GESTÃO DAS COOPERAÇÕES TÉCNICAS",valorTotal:60352517,coordenador:"MÁRCIO ALDRIN FRANÇA CAVALCANTE",secretarias:"Departamento de Cooperação Técnica e Desenvolvimento em Saúde - DECOOP",objeto:"Governança e gestão de cooperações técnicas",inicio:"2023-11-29",fim:"2027-11-29",saldoDI:370502.98,saldoGeral:7780562.11},
{id:"GEREB-018-FIO-25",numInstrumento:"153/2024",nome:"EDUCAÇÃO PERMANENTE EM SAÚDE: CAPACITAÇÃO DE TRABALHADORES, GESTORES E USUÁRIOS DO SUS",valorTotal:34797400,coordenador:"LUCIANA REZENDE DA SILVA GARCEZ",secretarias:"Secretaria de Gestão do Trabalho e da Educação na Saúde - SGTES",objeto:"Educação permanente em saúde",inicio:"2025-03-12",fim:"2029-03-12",saldoDI:125400.31,saldoGeral:4431925.39},
{id:"GEREB-009-FIO-24",numInstrumento:"168/2023",nome:"TERRITÓRIOS SAUDÁVEIS E SUSTENTÁVEIS NA PROMOÇÃO DO CUIDADO",valorTotal:24300010,coordenador:"ANDRE LUIZ DUTRA FENNER",secretarias:"Departamento de Promoção da Saúde / SAPS",objeto:"Promoção de territórios saudáveis e sustentáveis",inicio:"2024-01-12",fim:"2028-01-12",saldoDI:419436.57,saldoGeral:8808169.74},
{id:"GEREB-008-FIO-24",numInstrumento:"108/2023",nome:"QUALIFICAÇÃO DO CADASTRO NACIONAL DE ESTABELECIMENTOS DE SAÚDE (CNES)",valorTotal:5123000,coordenador:"OSVALDO PERALTA BONETTI",secretarias:"Secretaria de Gestão do Trabalho e da Educação na Saúde (SGTES)",objeto:"Qualificação do CNES",inicio:"2024-01-10",fim:"2026-01-10",saldoDI:9134.67,saldoGeral:191828.07},
{id:"GEREB-011-FIO-24",numInstrumento:"120/2023",nome:"DIAGNÓSTICO E ANÁLISE DA TRANSFORMAÇÃO DIGITAL EM SAÚDE NO BRASIL",valorTotal:1850253,coordenador:"MANOEL DE ARAÚJO AMORIM",secretarias:"Secretaria de Inovação e Saúde Digital - SEIDIGI/MS",objeto:"Diagnóstico da transformação digital em saúde",inicio:"2024-01-16",fim:"2025-07-16",saldoDI:528.77,saldoGeral:14336.93},
{id:"GEREB-021-FIO-22",numInstrumento:"25/2022",nome:"APRIMORAMENTO, QUALIFICAÇÃO E GESTÃO DE VIGILÂNCIA LABORATORIAL",valorTotal:1500000,coordenador:"NOELY FABIANA OLIVEIRA DE MOURA",secretarias:"SVS – Departamento de Articulação Estratégica de Vigilância em Saúde / DAEVS",objeto:"Aprimoramento da vigilância laboratorial",inicio:"2022-09-02",fim:"2025-07-20",saldoDI:581.72,saldoGeral:12216.14},
{id:"GEREB-008-FIO-25",numInstrumento:"148/2024",nome:"APOIO E FOMENTO AO DESENVOLVIMENTO DE SERVIÇOS, AÇÕES, ESTUDOS E INFORMAÇÕES ESTRATÉGICAS",valorTotal:137366000,coordenador:"LUCIANA REZENDE DA SILVA GARCEZ",secretarias:"Secretaria de Gestão do Trabalho e da Educação na Saúde - SGTES",objeto:"Apoio ao desenvolvimento de serviços e informações estratégicas",inicio:"2025-01-06",fim:"2029-01-06",saldoDI:60772.92,saldoGeral:3078837.32},
{id:"GEREB-008-FIO-20",numInstrumento:"50/2020",nome:"GESTÃO E GOVERNANÇA NO CAMPO DA CIÊNCIA, TECNOLOGIA E INOVAÇÃO EM SAÚDE",valorTotal:27103328,coordenador:"JOSE ANTONIO SILVESTRE FERNANDES NETO",secretarias:"Secretaria de Ciência, Tecnologia, Inovação e Insumos Estratégicos - SCTIE",objeto:"Gestão e governança em CT&IS",inicio:"2020-08-12",fim:"2025-08-05",saldoDI:0,saldoGeral:-54442.67},
{id:"GEREB-037-FIO-23",numInstrumento:"65/2023",nome:"PROJETO DE PESQUISA APLICADO À INOVAÇÃO NOS PROCESSOS DE AUDITORIA DO SUS",valorTotal:19594720,coordenador:"WAGNER DE JESUS MARTINS",secretarias:"Gabinete do Ministério da Saúde",objeto:"Inovação nos processos de auditoria do SUS",inicio:"2023-12-22",fim:"2027-07-22",saldoDI:52151.72,saldoGeral:1095186.85},
{id:"GEREB-012-FIO-24",numInstrumento:"166/2023",nome:"ESTRATÉGIA DE ENFRENTAMENTO AO RACISMO NA SAÚDE",valorTotal:32210366,coordenador:"DENISE OLIVEIRA E SILVA",secretarias:"Secretaria Executiva/MS",objeto:"Enfrentamento ao racismo na saúde",inicio:"2024-01-24",fim:"2027-01-24",saldoDI:1149.22,saldoGeral:24148.7},
{id:"GEREB-024-FIO-22",numInstrumento:"14/2022",nome:"PROGRAMA DE FORMAÇÃO A DISTÂNCIA PARA PROFISSIONAIS E GESTORES DO SUS",valorTotal:2826360,coordenador:"KELLEN CRISTINA DA SILVA GASQUE",secretarias:"Secretaria de Atenção Primária à Saúde (COGE/SAPS)",objeto:"Formação a distância para profissionais e gestores",inicio:"2022-09-15",fim:"2026-02-04",saldoDI:21792.62,saldoGeral:462026.41},
{id:"GEREB-003-FIO-24",numInstrumento:"82/2023",nome:"FORTALECIMENTO DO CENTRO NACIONAL DE INTELIGÊNCIA EPIDEMIOLÓGICA",valorTotal:15200000,coordenador:"NOELY FABIANA OLIVEIRA DE MOURA",secretarias:"Secretaria de Vigilância em Saúde e Ambiente - SVSA",objeto:"Fortalecimento do CNIE",inicio:"2024-01-03",fim:"2029-01-03",saldoDI:228066.27,saldoGeral:4789391.55},
{id:"GEREB-018-FIO-23",numInstrumento:"15/2023",nome:"APRIMORAMENTO DAS PRÁTICAS INSTITUCIONAIS NO ÂMBITO DO MINISTÉRIO DA SAÚDE",valorTotal:183000000,coordenador:"JOSE ANTONIO SILVESTRE FERNANDES NETO",secretarias:"SAA - Subsecretaria de Assuntos Administrativos",objeto:"Aprimoramento de práticas institucionais",inicio:"2023-09-27",fim:"2028-09-27",saldoDI:294674.98,saldoGeral:6594876.8},
{id:"GEREB-031-FIO-23",numInstrumento:"63/2023",nome:"PROGRAMA DE FORMAÇÃO DE AGENTES EDUCADORAS/ES POPULARES DE SAÚDE",valorTotal:23698852,coordenador:"OSVALDO PERALTA BONETTI",secretarias:"Secretaria de Gestão do Trabalho e da Educação na Saúde - SGTES",objeto:"Formação de agentes educadores populares de saúde",inicio:"2023-12-21",fim:"2025-12-21",saldoDI:14062.06,saldoGeral:296662.67},
{id:"GEREB-002-FIO-24",numInstrumento:"64/2023",nome:"O ENSINO DA SAÚDE DIGITAL NO BRASIL",valorTotal:2176078,coordenador:"DÉBORA DUPAS GONÇALVES DO NASCIMENTO",secretarias:"Gestão de Ensino/MS",objeto:"Estudo sobre ensino da saúde digital no Brasil",inicio:"2023-12-28",fim:"2025-12-28",saldoDI:12072.09,saldoGeral:721542.07},
{id:"GEREB-007-FIO-20",numInstrumento:"49/2020",nome:"FORTALECIMENTO DA VIGILÂNCIA DAS INFECÇÕES CRÔNICAS E IST",valorTotal:35000000,coordenador:"NOELY FABIANA OLIVEIRA DE MOURA",secretarias:"Secretaria de Vigilância em Saúde e Ambiente - SVSA",objeto:"Vigilância de infecções crônicas e IST",inicio:"2020-07-29",fim:"2026-07-02",saldoDI:22746.48,saldoGeral:558246.34}
];

// ============================================
// CÓDIGO PRINCIPAL DO DASHBOARD
// ============================================
let dadosFiltrados = [...gastos];
let chartRanking = null, chartRubrica = null, chartAreaRubric = null, tabelaGastos = null;

Chart.defaults.font.family = "Inter, sans-serif";
Chart.defaults.font.weight = "300";
Chart.defaults.color = "#667085";
Chart.defaults.plugins.tooltip.backgroundColor = "#101828";
Chart.defaults.plugins.tooltip.padding = 10;
Chart.defaults.plugins.tooltip.cornerRadius = 8;

function totalPorProjetoId(projetoId) {
    const idGasto = projetoIdParaGasto(projetoId);
    return gastos.filter(g => g.projeto === idGasto).reduce((acc, g) => acc + g.valor, 0);
}

function atualizarResumoFiltros() {
    const totalGasto = dadosFiltrados.reduce((acc, item) => acc + item.valor, 0);
    const projetosOnerados = new Set(dadosFiltrados.map(i => i.projeto)).size;
    const summary = document.getElementById("resultSummary");
    const chips = document.getElementById("activeFilters");
    if (summary) {
        summary.textContent = `${dadosFiltrados.length} lançamentos · ${projetosOnerados} projetos · ${fmtCurto(totalGasto)}`;
    }
    if (!chips) return;
    const ativos = [
        ["Projeto", document.getElementById("filter-projeto").value],
        ["Modalidade", document.getElementById("filter-rubrica").value],
        ["Área", document.getElementById("filter-area").value],
        ["Favorecido", document.getElementById("filter-favorecido").value],
        ["Início", document.getElementById("data-inicio").value ? dat(document.getElementById("data-inicio").value) : ""],
        ["Fim", document.getElementById("data-fim").value ? dat(document.getElementById("data-fim").value) : ""]
    ].filter(([, valor]) => valor);
    chips.innerHTML = ativos.map(([label, valor]) => `<span class="filter-chip">${label}: ${escapar(valor)}</span>`).join("");
}

function atualizarRanking() {
    const mapa = new Map();
    dadosFiltrados.forEach(item => mapa.set(item.projeto, (mapa.get(item.projeto) || 0) + item.valor));
    const ordenado = Array.from(mapa.entries()).sort((a,b) => b[1] - a[1]).slice(0, 12);
    const labels = ordenado.length ? ordenado.map(p => p[0]) : ["Sem dados"];
    const valores = ordenado.length ? ordenado.map(p => p[1]) : [0];
    if (chartRanking) chartRanking.destroy();
    const ctx = document.getElementById("rankingAllProjectsChart").getContext("2d");
    chartRanking = new Chart(ctx, {
        type: "bar",
        data: { labels, datasets: [{ label: "Executado", data: valores, backgroundColor: "#1d4f91", borderRadius: 4, barPercentage: 0.64, categoryPercentage: 0.62, maxBarThickness: 22 }] },
        options: {
            indexAxis: "y",
            responsive: true,
            maintainAspectRatio: false,
            scales: { x: { ticks: { callback: v => fmtCurto(v) }, grid: { color: "#f1f5f9", lineWidth: 1 }, border: { display: false } }, y: { grid: { display: false }, border: { display: false } } },
            plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => fmt(ctx.raw) } } }
        }
    });
}

function atualizarRankingSaldo() {
    const container = document.getElementById("rankingSaldoList");
    const comSaldo = projetos.filter(p => p.saldoDI > 0).sort((a,b) => b.saldoDI - a.saldoDI).slice(0,5);
    if (!container) return;
    if (comSaldo.length === 0) container.innerHTML = "<div class='empty-state'>Nenhum projeto com saldo DI positivo.</div>";
    else container.innerHTML = comSaldo.map((p, i) => `<div class="ranking-item"><div class="ranking-position">${i+1}</div><div class="ranking-info"><div class="ranking-projeto">${escapar(p.id)}</div><small>${escapar(p.nome)}</small></div><div class="ranking-value">${fmt(p.saldoDI)}</div></div>`).join('');
}

function atualizarRubrica() {
    const mapa = new Map();
    dadosFiltrados.forEach(item => mapa.set(item.rubrica, (mapa.get(item.rubrica) || 0) + item.valor));
    const labels = Array.from(mapa.keys());
    const valores = Array.from(mapa.values());
    if (chartRubrica) chartRubrica.destroy();
    const ctx = document.getElementById("rubricChart").getContext("2d");
    chartRubrica = new Chart(ctx, {
        type: "doughnut",
        data: { labels: labels.length ? labels : ["Sem dados"], datasets: [{ data: valores.length ? valores : [1], backgroundColor: labels.length ? labels.map(corRubrica) : ["#d9e1e8"], borderWidth: 1, borderColor: "#ffffff" }] },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: "72%",
            plugins: { legend: { position: "bottom", labels: { boxWidth: 10, usePointStyle: true } }, tooltip: { callbacks: { label: ctx => labels.length ? `${ctx.label}: ${fmt(ctx.raw)}` : "Sem dados" } } }
        }
    });
}

function obterResumoAreaRubrica() {
    const areaMap = new Map();
    dadosFiltrados.forEach(item => {
        if (!areaMap.has(item.area)) areaMap.set(item.area, new Map());
        areaMap.get(item.area).set(item.rubrica, (areaMap.get(item.area).get(item.rubrica) || 0) + item.valor);
    });
    const rubricas = [...new Set(dadosFiltrados.map(i => i.rubrica))].sort((a,b) => a.localeCompare(b, "pt-BR"));
    const linhas = Array.from(areaMap.entries()).map(([area, rubricasMap]) => {
        const valores = Object.fromEntries(rubricas.map(rubrica => [rubrica, rubricasMap.get(rubrica) || 0]));
        const total = Object.values(valores).reduce((acc, valor) => acc + valor, 0);
        return { area, valores, total };
    }).sort((a,b) => b.total - a.total);

    return { rubricas, linhas };
}

function atualizarAreaRubric() {
    const { rubricas, linhas } = obterResumoAreaRubrica();
    const linhasGrafico = linhas.slice(0, 10);
    const datasetRubricas = rubricas.length ? rubricas : ["Sem dados"];
    const labelsArea = linhasGrafico.length ? linhasGrafico.map(item => item.area) : ["Sem dados"];
    const datasets = datasetRubricas.map((rub, index) => ({
        label: rub,
        data: rubricas.length ? linhasGrafico.map(item => item.valores[rub] || 0) : [0],
        backgroundColor: rubricas.length ? corRubrica(rub, index) : "#d9e1e8",
        borderRadius: 3,
        barPercentage: 0.54,
        categoryPercentage: 0.5,
        maxBarThickness: 34,
        stack: "stack0"
    }));
    if (chartAreaRubric) chartAreaRubric.destroy();
    const ctx = document.getElementById("areaRubricChart").getContext("2d");
    chartAreaRubric = new Chart(ctx, {
        type: "bar",
        data: { labels: labelsArea, datasets: datasets },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { stacked: true, ticks: { autoSkip: false, maxRotation: 25, minRotation: 0 }, grid: { display: false }, border: { display: false } },
                y: { stacked: true, ticks: { callback: v => fmtCurto(v) }, grid: { color: "#f1f5f9", lineWidth: 1 }, border: { display: false } }
            },
            plugins: { legend: { position: "bottom", labels: { boxWidth: 8, boxHeight: 8, usePointStyle: true } }, tooltip: { callbacks: { label: ctx => `${ctx.dataset.label}: ${fmt(ctx.raw)}` } } }
        }
    });
}

function atualizarKPIs() {
    const totalGasto = dadosFiltrados.reduce((acc, i) => acc + i.valor, 0);
    const projetosOnerados = new Set(dadosFiltrados.map(i => i.projeto)).size;
    const mapaProjetos = new Map();
    const mapaAreas = new Map();
    dadosFiltrados.forEach(i => mapaProjetos.set(i.projeto, (mapaProjetos.get(i.projeto) || 0) + i.valor));
    dadosFiltrados.forEach(i => mapaAreas.set(i.area, (mapaAreas.get(i.area) || 0) + i.valor));
    const topProjeto = Array.from(mapaProjetos.entries()).sort((a,b) => b[1] - a[1])[0];
    const topArea = Array.from(mapaAreas.entries()).sort((a,b) => b[1] - a[1])[0];
    document.getElementById("kpiContainer").innerHTML = `
        <div class="kpi-card"><div class="kpi-title">Total gasto filtrado</div><div class="kpi-value">${fmt(totalGasto)}</div><span class="kpi-meta">${dadosFiltrados.length} lançamentos na visão atual</span></div>
        <div class="kpi-card"><div class="kpi-title">Projeto com maior gasto</div><div class="kpi-value">${topProjeto ? escapar(topProjeto[0]) : "N/A"}</div><span class="kpi-meta">${topProjeto ? fmt(topProjeto[1]) : "Sem registros no filtro"}</span></div>
        <div class="kpi-card"><div class="kpi-title">Saldo total DI dos projetos</div><div class="kpi-value">${fmt(TOTAL_SALDO_DI)}</div><span class="kpi-meta">Caixa Fiotec - 24/04/2026</span></div>
        <div class="kpi-card"><div class="kpi-title">Saldo total geral disponível</div><div class="kpi-value">${fmt(TOTAL_SALDO_GERAL)}</div><span class="kpi-meta">Caixa Geral Fiotec - 24/04/2026</span></div>
        <div class="kpi-card"><div class="kpi-title">Projetos onerados</div><div class="kpi-value">${projetosOnerados}</div><span class="kpi-meta">${topArea ? `Área líder: ${escapar(topArea[0])}` : "Sem área demandante"}</span></div>
    `;
}

function atualizarTabela() {
    if (tabelaGastos) tabelaGastos.destroy();
    tabelaGastos = new Tabulator("#gastos-table", {
        data: dadosFiltrados,
        placeholder: "Nenhum gasto encontrado para os filtros selecionados.",
        columnDefaults: { tooltip: true, headerFilterPlaceholder: "Filtrar" },
        columns: [
            { title: "Item", field: "item", width: 72, hozAlign: "center", headerFilter: "input" },
            { title: "Data", field: "data", width: 116, formatter: cell => dat(cell.getValue()), sorter: "string", headerFilter: "input" },
            { title: "Projeto", field: "projeto", width: 150, headerFilter: "input" },
            { title: "Área", field: "area", width: 160, headerFilter: "input" },
            { title: "Rubrica", field: "rubrica", width: 126, headerFilter: "input" },
            { title: "Modalidade", field: "modalidade", width: 126, headerFilter: "input" },
            { title: "Favorecido", field: "favorecido", minWidth: 220, headerFilter: "input" },
            { title: "Descrição", field: "descricao", minWidth: 300, headerFilter: "input" },
            { title: "Valor", field: "valor", width: 140, hozAlign: "right", formatter: cell => fmt(cell.getValue()), bottomCalc: "sum", bottomCalcFormatter: cell => fmt(cell.getValue()), headerFilter: "input" }
        ],
        layout: "fitDataStretch",
        initialSort: [{ column: "data", dir: "desc" }],
        pagination: "local",
        paginationSize: 15,
        height: "520px"
    });
}

function atualizarTudo() {
    atualizarResumoFiltros();
    atualizarKPIs();
    atualizarRanking();
    atualizarRubrica();
    atualizarAreaRubric();
    atualizarTabela();
    atualizarRankingSaldo();
}

function aplicarFiltros() {
    let resultado = [...gastos];
    const projeto = document.getElementById("filter-projeto").value;
    const rubrica = document.getElementById("filter-rubrica").value;
    const area = document.getElementById("filter-area").value;
    const favorecido = document.getElementById("filter-favorecido").value;
    const dataInicio = document.getElementById("data-inicio").value;
    const dataFim = document.getElementById("data-fim").value;
    if (projeto) resultado = resultado.filter(i => i.projeto === projeto);
    if (rubrica) resultado = resultado.filter(i => i.rubrica === rubrica);
    if (area) resultado = resultado.filter(i => i.area === area);
    if (favorecido) resultado = resultado.filter(i => i.favorecido === favorecido);
    if (dataInicio) resultado = resultado.filter(i => i.data >= dataInicio);
    if (dataFim) resultado = resultado.filter(i => i.data <= dataFim);
    dadosFiltrados = resultado;
    atualizarTudo();
}

function resetFiltros() {
    document.getElementById("filter-projeto").value = "";
    document.getElementById("filter-rubrica").value = "";
    document.getElementById("filter-area").value = "";
    document.getElementById("filter-favorecido").value = "";
    document.getElementById("data-inicio").value = "";
    document.getElementById("data-fim").value = "";
    dadosFiltrados = [...gastos];
    atualizarTudo();
}

function exportarCSV() {
    if (!tabelaGastos) return;
    const data = tabelaGastos.getData();
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "gastos_di_2026_filtrados.csv";
    link.click();
}

function carregarFiltros() {
    const projetosUnicos = [...new Set(gastos.map(g => g.projeto))].sort();
    const rubricasUnicas = [...new Set(gastos.map(g => g.rubrica))].sort();
    const areasUnicas = [...new Set(gastos.map(g => g.area))].sort();
    const favorecidosUnicos = [...new Set(gastos.map(g => g.favorecido))].sort();
    document.getElementById("filter-projeto").innerHTML = '<option value="">Todos</option>' + projetosUnicos.map(p => `<option value="${escapar(p)}">${escapar(p)}</option>`).join('');
    document.getElementById("filter-rubrica").innerHTML = '<option value="">Todas</option>' + rubricasUnicas.map(r => `<option value="${escapar(r)}">${escapar(r)}</option>`).join('');
    document.getElementById("filter-area").innerHTML = '<option value="">Todas</option>' + areasUnicas.map(a => `<option value="${escapar(a)}">${escapar(a)}</option>`).join('');
    document.getElementById("filter-favorecido").innerHTML = '<option value="">Todos</option>' + favorecidosUnicos.map(f => `<option value="${escapar(f)}">${escapar(f)}</option>`).join('');
}

function renderizarTabelaAreaRubrica() {
    const table = document.getElementById("areaRubricaTable");
    const summary = document.getElementById("areaRubricaModalSummary");
    if (!table || !summary) return;

    const { rubricas, linhas } = obterResumoAreaRubrica();
    const totalGeral = linhas.reduce((acc, linha) => acc + linha.total, 0);
    summary.textContent = `${linhas.length} áreas · ${rubricas.length} rubricas · ${fmt(totalGeral)} na visão atual`;

    if (!linhas.length) {
        table.innerHTML = '<tbody><tr><td>Nenhum dado encontrado para os filtros selecionados.</td></tr></tbody>';
        return;
    }

    const cabecalho = `
        <thead>
            <tr>
                <th>Área</th>
                ${rubricas.map(rubrica => `<th class="number-cell">${escapar(rubrica)}</th>`).join("")}
                <th class="number-cell">Total</th>
            </tr>
        </thead>
    `;
    const corpo = `
        <tbody>
            ${linhas.map(linha => `
                <tr>
                    <td>${escapar(linha.area)}</td>
                    ${rubricas.map(rubrica => `<td class="number-cell">${fmt(linha.valores[rubrica] || 0)}</td>`).join("")}
                    <td class="number-cell total-cell">${fmt(linha.total)}</td>
                </tr>
            `).join("")}
        </tbody>
    `;
    table.innerHTML = cabecalho + corpo;
}

function abrirModalAreaRubrica() {
    const modal = document.getElementById("areaRubricaModal");
    if (!modal) return;
    renderizarTabelaAreaRubrica();
    modal.classList.remove("is-hidden");
    document.body.classList.add("modal-open");
    document.getElementById("fecharAreaRubricaModal")?.focus();
}

function fecharModalAreaRubrica() {
    const modal = document.getElementById("areaRubricaModal");
    if (!modal) return;
    modal.classList.add("is-hidden");
    document.body.classList.remove("modal-open");
}

function configurarModalAreaRubrica() {
    document.getElementById("verMaisAreaRubrica")?.addEventListener("click", abrirModalAreaRubrica);
    document.getElementById("fecharAreaRubricaModal")?.addEventListener("click", fecharModalAreaRubrica);
    document.querySelector("#areaRubricaModal [data-modal-close]")?.addEventListener("click", fecharModalAreaRubrica);
    document.addEventListener("keydown", event => {
        if (event.key === "Escape") fecharModalAreaRubrica();
    });
}

function configurarDetalhesProjeto() {
    const projSelect = document.getElementById("projetoDetalhesSelect");
    const instSelect = document.getElementById("instrumentoDetalhesSelect");
    projSelect.innerHTML = '<option value="">Selecione um projeto</option>';
    projetos.forEach(p => {
        const opt = document.createElement("option");
        opt.value = p.id;
        opt.textContent = `${p.id} - ${p.nome.substring(0,60)}${p.nome.length > 60 ? "..." : ""}`;
        projSelect.appendChild(opt);
    });
    const instSet = new Set();
    projetos.forEach(p => { if (p.numInstrumento) instSet.add(p.numInstrumento); });
    instSelect.innerHTML = '<option value="">Selecione um número</option>';
    Array.from(instSet).sort().forEach(num => {
        const opt = document.createElement("option");
        opt.value = num;
        opt.textContent = num;
        instSelect.appendChild(opt);
    });
    function mostrarDetalhes() {
        const projId = projSelect.value;
        const instNum = instSelect.value;
        let projeto = null;
        if (projId) projeto = projetos.find(p => p.id === projId);
        else if (instNum) projeto = projetos.find(p => p.numInstrumento === instNum);
        if (projeto) {
            const execucaoDI = totalPorProjetoId(projeto.id);
            const percentualExecucao = projeto.valorTotal ? (execucaoDI / projeto.valorTotal * 100).toLocaleString("pt-BR", {minimumFractionDigits: 2, maximumFractionDigits: 2}) + "%" : "N/A";
            if (projSelect.value !== projeto.id) projSelect.value = projeto.id;
            if (instSelect.value !== projeto.numInstrumento) instSelect.value = projeto.numInstrumento;
            document.getElementById("projetoInfoContainer").classList.remove("is-hidden");
            document.getElementById("projetoInfoGrid").innerHTML = `
                <div class="info-card"><div class="info-label">IDENTIFICAÇÃO DO PROJETO FIOTEC</div><div class="info-value">${escapar(projeto.id)}</div></div>
                <div class="info-card"><div class="info-label">NÚMERO DO INSTRUMENTO</div><div class="info-value">${escapar(projeto.numInstrumento || "Não informado")}</div></div>
                <div class="info-card"><div class="info-label">NOME DO PROJETO</div><div class="info-value">${escapar(projeto.nome)}</div></div>
                <div class="info-card"><div class="info-label">VALOR TOTAL DO PROJETO</div><div class="info-value">${fmt(projeto.valorTotal)}</div></div>
                <div class="info-card"><div class="info-label">EXECUÇÃO DI 2026</div><div class="info-value positive">${fmt(execucaoDI)}</div></div>
                <div class="info-card"><div class="info-label">PERCENTUAL EXECUTADO</div><div class="info-value">${percentualExecucao}</div></div>
                <div class="info-card"><div class="info-label">COORDENADOR</div><div class="info-value">${escapar(projeto.coordenador)}</div></div>
                <div class="info-card"><div class="info-label">SECRETARIAS</div><div class="info-value">${escapar(projeto.secretarias || "Não informada")}</div></div>
                <div class="info-card"><div class="info-label">INÍCIO DA VIGÊNCIA</div><div class="info-value">${dat(projeto.inicio)}</div></div>
                <div class="info-card"><div class="info-label">FINAL DA VIGÊNCIA</div><div class="info-value">${dat(projeto.fim)}</div></div>
                <div class="info-card"><div class="info-label">SALDO DI DISPONÍVEL</div><div class="info-value ${projeto.saldoDI >= 0 ? "positive" : ""}">${fmt(projeto.saldoDI)}</div></div>
                <div class="info-card"><div class="info-label">SALDO GERAL DISPONÍVEL</div><div class="info-value ${projeto.saldoGeral >= 0 ? "positive" : ""}">${fmt(projeto.saldoGeral)}</div></div>
                <div class="info-card objeto-text"><div class="info-label">OBJETO DO PROJETO</div><div class="info-value large">${escapar(projeto.objeto)}</div></div>
            `;
        } else {
            document.getElementById("projetoInfoContainer").classList.add("is-hidden");
        }
    }
    projSelect.addEventListener("change", mostrarDetalhes);
    instSelect.addEventListener("change", mostrarDetalhes);
}

document.addEventListener("DOMContentLoaded", () => {
    carregarFiltros();
    configurarDetalhesProjeto();
    configurarModalAreaRubrica();
    atualizarTudo();
    document.getElementById("aplicar-filtros").addEventListener("click", aplicarFiltros);
    document.getElementById("reset-filtros").addEventListener("click", resetFiltros);
    document.getElementById("export-csv").addEventListener("click", exportarCSV);
});

