## 🔢 Tipos de Rate Limiting e Diferenças

O ASP.NET Core suporta diferentes **algoritmos de Rate Limiting**, cada um adequado para um tipo de cenário. Entender a diferença entre eles é essencial para escolher a estratégia correta.

---

### 1️⃣ Fixed Window

**Como funciona:**
- Divide o tempo em janelas fixas (ex: 10 segundos).
- Cada cliente pode fazer um número máximo de requisições dentro dessa janela.
- Quando a janela expira, o contador é resetado.

**Exemplo:**
- Limite: 5 requisições a cada 10 segundos  
- O cliente faz 5 requisições no segundo 1 → bloqueado até o segundo 10

**Vantagens:**
- Simples de entender
- Fácil de implementar
- Baixo custo computacional

**Desvantagens:**
- Pode gerar picos de requisição no início de cada janela
- Menos justo em cenários de alto tráfego

**Quando usar:**
- APIs pequenas
- Sistemas internos
- Protótipos e MVPs

---

### 2️⃣ Sliding Window

**Como funciona:**
- Em vez de janelas fixas, o limite é calculado com base em um intervalo de tempo móvel.
- O sistema considera as requisições feitas nos últimos X segundos a partir do momento atual.

**Exemplo:**
- Limite: 5 requisições nos últimos 10 segundos
- Cada nova requisição “desliza” a janela no tempo

**Vantagens:**
- Mais justo que Fixed Window
- Evita explosões de tráfego no início da janela

**Desvantagens:**
- Implementação mais complexa
- Maior consumo de memória e processamento

**Quando usar:**
- APIs públicas
- Serviços com tráfego constante
- Casos onde justiça no consumo é importante

---

### 3️⃣ Token Bucket

**Como funciona:**
- Um “balde” de tokens é preenchido ao longo do tempo
- Cada requisição consome 1 token
- Se não houver tokens, a requisição é bloqueada
- Tokens são reabastecidos automaticamente

**Exemplo:**
- Balde com 10 tokens
- Reabastece 5 tokens a cada 10 segundos
- Permite rajadas controladas de requisições

**Vantagens:**
- Muito flexível
- Permite picos de uso controlados
- Excelente experiência para o cliente

**Desvantagens:**
- Configuração mais complexa
- Exige bom ajuste dos parâmetros

**Quando usar:**
- APIs públicas
- Integrações externas
- Cenários estilo GitHub / Stripe / APIs comerciais

---

### 4️⃣ Concurrency Limiter

**Como funciona:**
- Limita o número de requisições simultâneas
- Não depende de tempo, apenas de concorrência
- Se o limite for atingido, novas requisições aguardam ou são rejeitadas

**Exemplo:**
- Máximo de 3 requisições simultâneas
- A 4ª requisição é bloqueada até uma finalizar

**Vantagens:**
- Protege recursos críticos
- Evita sobrecarga do servidor
- Ótimo para operações pesadas

**Desvantagens:**
- Não controla volume ao longo do tempo
- Pode gerar fila de espera

**Quando usar:**
- Endpoints pesados
- Processamentos longos
- Integrações com recursos limitados (ex: APIs externas)

---

## 🧠 Comparação Rápida

| Tipo | Controla | Melhor Uso |
|----|---------|-----------|
| Fixed Window | Quantidade por tempo fixo | APIs simples |
| Sliding Window | Quantidade por tempo móvel | APIs públicas |
| Token Bucket | Volume + rajadas | APIs comerciais |
| Concurrency | Requisições simultâneas | Processos pesados |

---

## ✅ Qual escolher?

- **Simples e rápido:** Fixed Window  
- **Justiça e controle:** Sliding Window  
- **Experiência do cliente:** Token Bucket  
- **Proteção de recursos:** Concurrency Limiter  

Em muitos casos, é possível **combinar diferentes políticas** em endpoints distintos da mesma API.
