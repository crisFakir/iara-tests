# Exemplos Práticos Resolvidos - Perspectiva Isométrica

## 📋 Exemplo 1: CUBO BÁSICO (50mm)

### Dados do Problema:
- Objeto: Cubo
- Aresta: 50mm
- Desenhar em: Ambas as perspectivas

---

### 🔷 SOLUÇÃO - PERSPECTIVA SIMPLIFICADA

#### Etapa 1: Cálculo das Medidas
```
Medida Real = 50mm
Fator = 1,0

Medida no desenho = 50 × 1,0 = 50mm

Todas as arestas: 50mm (sem conversão)
```

#### Etapa 2: Sequência de Construção
```
1. Marque o ponto origem O
2. Trace os três eixos (30°, 30°, 90°)
3. Marque nos eixos:
   - X: 50mm à direita (30°)
   - Y: 50mm à esquerda (30°)
   - Z: 50mm para cima (90°)

4. A partir do ponto X (50mm no eixo X):
   - Linha paralela ao eixo Y: 50mm
   - Linha paralela ao eixo Z: 50mm

5. A partir do ponto Y (50mm no eixo Y):
   - Linha paralela ao eixo X: 50mm
   - Linha paralela ao eixo Z: 50mm

6. A partir do ponto Z (50mm no eixo Z):
   - Linha paralela ao eixo X: 50mm
   - Linha paralela ao eixo Y: 50mm

7. Complete fechando o cubo
```

#### Resultado:
✅ Cubo isométrico com arestas de **50mm** no papel

---

### 🔶 SOLUÇÃO - PERSPECTIVA REAL

#### Etapa 1: Cálculo das Medidas
```
Medida Real = 50mm
Fator = 0,816

Medida no desenho = 50 × 0,816 = 40,8mm

Todas as arestas: 40,8mm
```

#### Etapa 2: Sequência de Construção
```
IDÊNTICA à simplificada, mas usando 40,8mm:

1. Marque o ponto origem O
2. Trace os três eixos (30°, 30°, 90°)
3. Marque nos eixos:
   - X: 40,8mm à direita (30°)
   - Y: 40,8mm à esquerda (30°)
   - Z: 40,8mm para cima (90°)

4-7. Mesmos passos da simplificada
```

#### Resultado:
✅ Cubo isométrico com arestas de **40,8mm** no papel (menor)

---

## 📋 Exemplo 2: PARALELEPÍPEDO

### Dados do Problema:
- Comprimento (eixo X): 90mm
- Largura (eixo Y): 45mm
- Altura (eixo Z): 60mm

---

### 🔷 PERSPECTIVA SIMPLIFICADA

```
Cálculos:
X = 90mm (direto)
Y = 45mm (direto)
Z = 60mm (direto)

Construção:
1. Origem O
2. Marque X = 90mm (30° direita)
3. Marque Y = 45mm (30° esquerda)
4. Marque Z = 60mm (vertical)
5. Complete a base (X-Y)
6. Levante as verticais (Z)
7. Complete o topo
```

**Medidas no desenho:**
- Comprimento: 90mm
- Largura: 45mm
- Altura: 60mm

---

### 🔶 PERSPECTIVA REAL

```
Cálculos:
X = 90 × 0,816 = 73,4mm
Y = 45 × 0,816 = 36,7mm
Z = 60 × 0,816 = 49,0mm

Construção:
1. Origem O
2. Marque X = 73,4mm (30° direita)
3. Marque Y = 36,7mm (30° esquerda)
4. Marque Z = 49,0mm (vertical)
5. Complete a base (X-Y)
6. Levante as verticais (Z)
7. Complete o topo
```

**Medidas no desenho:**
- Comprimento: 73,4mm
- Largura: 36,7mm
- Altura: 49,0mm

---

## 📋 Exemplo 3: PEÇA EM "L"

### Dados do Problema:
- Base horizontal: 80mm × 50mm × 20mm (C×L×A)
- Parte vertical: 30mm × 50mm × 60mm (C×L×A)
- A parte vertical está apoiada numa extremidade da base

---

### 🔷 PERSPECTIVA SIMPLIFICADA

#### Passo 1: Desenhar a BASE
```
Dimensões da base:
X = 80mm
Y = 50mm
Z = 20mm

1. Origem O (canto frontal inferior esquerdo)
2. Marque e desenhe o paralelepípedo 80×50×20mm
```

#### Passo 2: Desenhar a PARTE VERTICAL
```
Dimensões:
X = 30mm
Y = 50mm (mesma largura da base)
Z = 60mm

1. Origem: topo da base, na extremidade
   (a 80mm de O no eixo X, e 20mm no eixo Z)
2. A partir deste ponto:
   - X: 30mm
   - Y: 50mm
   - Z: 60mm
3. Complete o paralelepípedo
```

**Total de medidas:**
- Base: 80 × 50 × 20mm no papel
- Vertical: 30 × 50 × 60mm no papel

---

### 🔶 PERSPECTIVA REAL

#### Passo 1: Calcular TODAS as medidas

**Base:**
```
X = 80 × 0,816 = 65,3mm
Y = 50 × 0,816 = 40,8mm
Z = 20 × 0,816 = 16,3mm
```

**Parte Vertical:**
```
X = 30 × 0,816 = 24,5mm
Y = 50 × 0,816 = 40,8mm
Z = 60 × 0,816 = 49,0mm
```

#### Passo 2: Construir
```
1. Base: 65,3 × 40,8 × 16,3mm
2. Vertical (no topo da base): 24,5 × 40,8 × 49,0mm
```

---

## 📋 Exemplo 4: PEÇA COM FURO

### Dados do Problema:
- Bloco: 60mm × 60mm × 40mm
- Furo circular passante: Ø20mm (centro do bloco)
- Furo paralelo ao eixo Z

---

### 🔷 PERSPECTIVA SIMPLIFICADA

#### Parte 1: O Bloco
```
X = 60mm
Y = 60mm
Z = 40mm

Desenhe o paralelepípedo normalmente
```

#### Parte 2: O Furo (ELIPSE!)

**⚠️ IMPORTANTE:** Círculos em isométrica viram ELIPSES!

```
1. Localize o centro do furo:
   - A 30mm de X (metade de 60mm)
   - A 30mm de Y (metade de 60mm)
   - Na face superior (Z = 40mm)

2. No plano XY (horizontal):
   - Diâmetro real: 20mm
   - Em isométrica: elipse com:
     * Eixo maior: 20mm
     * Eixo menor: 20 × sen(35°16') ≈ 11,5mm
   
3. Use gabarito de elipse 35°16' ou construa por pontos
```

#### Parte 3: Profundidade do Furo
```
1. Desenhe linhas verticais tangentes à elipse superior
2. Desenhe outra elipse idêntica na base (Z = 0)
3. Complete as linhas tangentes
```

---

### 🔶 PERSPECTIVA REAL

#### Parte 1: O Bloco
```
X = 60 × 0,816 = 49,0mm
Y = 60 × 0,816 = 49,0mm
Z = 40 × 0,816 = 32,6mm
```

#### Parte 2: O Furo
```
1. Centro do furo (medidas reduzidas):
   - A 24,5mm de X (49/2)
   - A 24,5mm de Y (49/2)
   - Na face superior (Z = 32,6mm)

2. Diâmetro do furo:
   - Real: 20mm
   - Reduzido: 20 × 0,816 = 16,3mm
   
3. Elipse com:
   - Eixo maior: 16,3mm
   - Eixo menor: 16,3 × sen(35°16') ≈ 9,4mm
```

---

## 📋 Exemplo 5: ESCADA (3 degraus)

### Dados do Problema:
- Largura total: 100mm
- Profundidade total: 60mm
- Cada degrau: 20mm de altura
- 3 degraus iguais

---

### 🔷 PERSPECTIVA SIMPLIFICADA

```
Dimensões de cada degrau:
- Largura (Y): 100mm (constante)
- Profundidade (X): 20mm cada
- Altura (Z): 20mm cada

Construção em camadas:

Degrau 1 (mais baixo):
- Origem: O
- Base: 60 × 100mm (X×Y)
- Altura: 20mm (Z)

Degrau 2:
- Origem: 20mm acima e 20mm atrás do degrau 1
- Base: 40 × 100mm
- Altura: 20mm

Degrau 3 (mais alto):
- Origem: 20mm acima e 20mm atrás do degrau 2
- Base: 20 × 100mm
- Altura: 20mm
```

**Todas as medidas usadas diretamente (sem conversão)**

---

### 🔶 PERSPECTIVA REAL

```
Converter TODAS as medidas:
- 100mm → 81,6mm
- 60mm → 49,0mm
- 20mm → 16,3mm

Degrau 1:
- Base: 49,0 × 81,6mm
- Altura: 16,3mm

Degrau 2:
- Base: 32,6 × 81,6mm (40×0,816 = 32,6)
- Altura: 16,3mm

Degrau 3:
- Base: 16,3 × 81,6mm
- Altura: 16,3mm
```

---

## 📊 Tabela Comparativa Final

| Objeto | Medida Real | Simplificada | Real | Diferença |
|--------|-------------|--------------|------|-----------|
| Cubo 50mm | 50×50×50 | 50×50×50 | 40,8×40,8×40,8 | 22,5% |
| Paralelepípedo | 90×45×60 | 90×45×60 | 73,4×36,7×49,0 | 22,5% |
| Furo Ø20 | Ø20 | Ø20 | Ø16,3 | 22,5% |

---

## 🎯 Exercícios para Você Resolver

Calcule as medidas para **ambas as perspectivas**:

### Exercício 1:
Cubo de 75mm de aresta

**Simplificada:** _____________
**Real:** _____________

### Exercício 2:
Bloco: 120mm × 80mm × 45mm

**Simplificada:**
- X: _______
- Y: _______
- Z: _______

**Real:**
- X: _______
- Y: _______
- Z: _______

### Exercício 3:
Cilindro: Ø30mm, altura 50mm (furo passante vertical)

**Simplificada:**
- Diâmetro: _______
- Altura: _______

**Real:**
- Diâmetro: _______
- Altura: _______

---

## 💡 Dicas Importantes

1. **Sempre verifique** qual perspectiva está usando antes de começar
2. **Na simplificada**: copie as medidas direto do projeto
3. **Na real**: PRIMEIRO calcule todas as medidas, DEPOIS desenhe
4. **Use calculadora**: 0,816 × medida_real
5. **Em CAD**: a simplificada é o padrão (não precisa converter)

---

## ✅ Gabarito dos Exercícios

### Exercício 1:
- **Simplificada:** 75mm
- **Real:** 61,2mm

### Exercício 2:
**Simplificada:**
- X: 120mm
- Y: 80mm
- Z: 45mm

**Real:**
- X: 97,9mm
- Y: 65,3mm
- Z: 36,7mm

### Exercício 3:
**Simplificada:**
- Diâmetro: 30mm
- Altura: 50mm

**Real:**
- Diâmetro: 24,5mm
- Altura: 40,8mm

---

**Pratique bastante! A repetição é a chave para dominar perspectiva isométrica.** 🚀
