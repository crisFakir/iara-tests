# Analisador de Euromilhões 🎰

Ferramenta de análise estatística para gerar combinações de números do Euromilhões baseadas em dados históricos.

## 🎯 As 3 Chaves Recomendadas

Execute o script para obter as 3 combinações recomendadas:

```bash
python3 euromillions_analyzer.py
```

## 📊 Estratégias Utilizadas

### Chave 1: Números Mais Sorteados (Hot Numbers)
Baseado na teoria de que números que aparecem frequentemente continuam a aparecer. Esta estratégia seleciona os números mais sorteados historicamente.

### Chave 2: Números Menos Sorteados (Cold Numbers)
Baseado na teoria de que números pouco sorteados estão "devidos" e têm maior probabilidade de sair. Esta estratégia seleciona os números menos frequentes.

### Chave 3: Combinação Equilibrada (Balanced)
Mistura inteligente que combina:
- 60% números quentes + 40% números frios
- Proporção otimizada de números pares/ímpares (baseada na média histórica)
- Distribuição equilibrada de números

## 📈 Análise Estatística

O script analisa:
- **Frequência de números**: Quais números principais e estrelas aparecem mais/menos
- **Intervalos**: Análise de gaps entre números consecutivos
- **Proporção Par/Ímpar**: Média histórica de números ímpares por sorteio

## ⚠️ Avisos Importantes

### Probabilidades
- **Probabilidade de ganhar o jackpot**: Aproximadamente **1 em 139.838.160**
- **Probabilidade de acertar 5 números + 2 estrelas**: A mesma para qualquer combinação
- Cada sorteio é **independente** - resultados passados não influenciam resultados futuros

### Limitações
1. **Loteria é aleatória**: Não existe estratégia que possa aumentar matematicamente as chances de ganhar
2. **Dados históricos**: O script usa dados de exemplo. Para análise completa, seria necessário acesso a todos os sorteios históricos
3. **Fins informativos**: Esta ferramenta é para fins educacionais e estatísticos apenas

### Teorias vs Realidade
- **Hot/Cold Numbers**: Apesar de serem teorias populares, em loterias verdadeiramente aleatórias, cada número tem a mesma probabilidade
- **Padrões**: Padrões observados em dados históricos são apenas coincidências estatísticas
- **Não há "número devido"**: Cada sorteio é independente

## 🔧 Como Funciona

1. **Análise de Frequência**: Conta quantas vezes cada número apareceu
2. **Análise de Padrões**: Calcula intervalos médios e proporções
3. **Geração de Combinações**: Aplica diferentes estratégias estatísticas
4. **Validação**: Garante que as 3 combinações são diferentes entre si

## 📝 Estrutura do Euromilhões

- **Números principais**: 5 números de 1 a 50
- **Estrelas**: 2 estrelas de 1 a 12
- **Total de combinações possíveis**: 139.838.160

## 🍀 Boa Sorte!

Lembre-se: jogar é divertido, mas jogue com responsabilidade. Não aposte mais do que pode perder.

---

**Nota**: Este projeto é para fins educacionais. A loteria é um jogo de sorte pura e não há garantias de ganhos.
