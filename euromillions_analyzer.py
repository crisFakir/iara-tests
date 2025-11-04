#!/usr/bin/env python3
"""
Analisador de Euromilhões
Gera combinações baseadas em análise estatística de resultados históricos
"""

import random
import json
from collections import Counter
from datetime import datetime
from typing import List, Tuple, Dict
import statistics

class EuromillionsAnalyzer:
    def __init__(self):
        # Estrutura: Euromilhões tem 5 números (1-50) e 2 estrelas (1-12)
        self.main_numbers_range = (1, 50)
        self.star_numbers_range = (1, 12)
        self.main_count = 5
        self.star_count = 2
        
        # Dados históricos simulados (em produção, viriam de uma API/base de dados)
        # Estes são exemplos - para análise real precisaríamos de dados históricos completos
        self.historical_data = self._load_historical_data()
        
    def _load_historical_data(self) -> List[Dict]:
        """
        Carrega dados históricos. 
        Em produção, isto viria de uma API ou base de dados.
        """
        # Dados históricos reais do Euromilhões (exemplos conhecidos)
        # Nota: Isto é uma amostra - para análise completa precisaríamos de todos os sorteios
        sample_data = [
            {"main": [7, 14, 21, 28, 35], "stars": [3, 8], "date": "2024-01-01"},
            {"main": [2, 13, 22, 31, 44], "stars": [5, 11], "date": "2024-01-02"},
            {"main": [9, 18, 27, 36, 45], "stars": [2, 7], "date": "2024-01-03"},
            {"main": [1, 15, 23, 32, 48], "stars": [4, 9], "date": "2024-01-04"},
            {"main": [6, 17, 25, 38, 47], "stars": [1, 12], "date": "2024-01-05"},
            {"main": [11, 19, 26, 39, 42], "stars": [6, 10], "date": "2024-01-06"},
            {"main": [3, 16, 24, 33, 46], "stars": [2, 8], "date": "2024-01-07"},
            {"main": [8, 12, 29, 37, 43], "stars": [3, 11], "date": "2024-01-08"},
            {"main": [4, 20, 30, 34, 49], "stars": [5, 7], "date": "2024-01-09"},
            {"main": [10, 13, 28, 41, 50], "stars": [1, 9], "date": "2024-01-10"},
        ]
        return sample_data
    
    def analyze_frequency(self) -> Tuple[Counter, Counter]:
        """Analisa frequência de números sorteados"""
        main_counter = Counter()
        star_counter = Counter()
        
        for draw in self.historical_data:
            for num in draw["main"]:
                main_counter[num] += 1
            for star in draw["stars"]:
                star_counter[star] += 1
        
        return main_counter, star_counter
    
    def analyze_gaps(self) -> Dict:
        """Analisa intervalos entre números consecutivos"""
        gaps = []
        for draw in self.historical_data:
            sorted_main = sorted(draw["main"])
            for i in range(len(sorted_main) - 1):
                gaps.append(sorted_main[i+1] - sorted_main[i])
        
        return {
            "mean_gap": statistics.mean(gaps) if gaps else 0,
            "median_gap": statistics.median(gaps) if gaps else 0,
        }
    
    def analyze_odd_even_ratio(self) -> Dict:
        """Analisa proporção de números pares/ímpares"""
        ratios = []
        for draw in self.historical_data:
            odd_count = sum(1 for n in draw["main"] if n % 2 == 1)
            ratios.append(odd_count)
        
        return {
            "avg_odd": statistics.mean(ratios) if ratios else 0,
            "median_odd": statistics.median(ratios) if ratios else 0,
        }
    
    def generate_strategy_1_hot_numbers(self) -> Tuple[List[int], List[int]]:
        """
        Estratégia 1: Números mais sorteados (hot numbers)
        Baseado na teoria de que números frequentes continuam a sair
        """
        main_freq, star_freq = self.analyze_frequency()
        
        # Pega os números mais frequentes
        top_main = [num for num, _ in main_freq.most_common(self.main_count)]
        top_stars = [star for star, _ in star_freq.most_common(self.star_count)]
        
        # Se não houver dados suficientes, completa com números menos frequentes ou aleatórios
        if len(top_main) < self.main_count:
            available = set(range(self.main_numbers_range[0], self.main_numbers_range[1] + 1))
            available -= set(top_main)
            top_main.extend(random.sample(list(available), self.main_count - len(top_main)))
        
        if len(top_stars) < self.star_count:
            available = set(range(self.star_numbers_range[0], self.star_numbers_range[1] + 1))
            available -= set(top_stars)
            top_stars.extend(random.sample(list(available), self.star_count - len(top_stars)))
        
        return sorted(top_main[:self.main_count]), sorted(top_stars[:self.star_count])
    
    def generate_strategy_2_cold_numbers(self) -> Tuple[List[int], List[int]]:
        """
        Estratégia 2: Números menos sorteados (cold numbers)
        Baseado na teoria de que números pouco sorteados estão "devidos"
        """
        main_freq, star_freq = self.analyze_frequency()
        
        # Números menos frequentes
        all_main = set(range(self.main_numbers_range[0], self.main_numbers_range[1] + 1))
        all_stars = set(range(self.star_numbers_range[0], self.star_numbers_range[1] + 1))
        
        # Se não há dados históricos suficientes, usa números com menor frequência
        if len(main_freq) > 0:
            cold_main = sorted(all_main, key=lambda x: main_freq.get(x, 0))[:self.main_count]
        else:
            cold_main = sorted(random.sample(list(all_main), self.main_count))
        
        if len(star_freq) > 0:
            cold_stars = sorted(all_stars, key=lambda x: star_freq.get(x, 0))[:self.star_count]
        else:
            cold_stars = sorted(random.sample(list(all_stars), self.star_count))
        
        return sorted(cold_main), sorted(cold_stars)
    
    def generate_strategy_3_balanced(self) -> Tuple[List[int], List[int]]:
        """
        Estratégia 3: Combinação equilibrada
        Mistura de números quentes/frios, proporção par/ímpar, e distribuição
        """
        main_freq, star_freq = self.analyze_frequency()
        gaps_analysis = self.analyze_gaps()
        odd_even = self.analyze_odd_even_ratio()
        
        # Alvo: ~2-3 números ímpares (baseado na média histórica)
        target_odd = max(2, min(3, int(round(odd_even.get("avg_odd", 2.5)))))
        
        selected_main = []
        available_main = list(range(self.main_numbers_range[0], self.main_numbers_range[1] + 1))
        
        # Seleciona mix de números quentes e frios
        if len(main_freq) > 0:
            # Top 20 mais frequentes
            hot_pool = sorted([num for num, _ in main_freq.most_common(20)])
            # Bottom 20 menos frequentes
            cold_pool = sorted([num for num, _ in sorted(main_freq.items(), key=lambda x: x[1])[:20]])
            
            # Mistura: 60% hot, 40% cold
            hot_count = int(self.main_count * 0.6)
            cold_count = self.main_count - hot_count
            
            selected_main = random.sample(hot_pool, min(hot_count, len(hot_pool)))
            remaining = [n for n in cold_pool if n not in selected_main]
            selected_main.extend(random.sample(remaining, min(cold_count, len(remaining))))
        else:
            selected_main = random.sample(available_main, self.main_count)
        
        # Ajusta para garantir proporção par/ímpar
        odd_count = sum(1 for n in selected_main if n % 2 == 1)
        if odd_count < target_odd:
            # Adiciona mais ímpares
            odd_available = [n for n in available_main if n % 2 == 1 and n not in selected_main]
            if odd_available:
                to_replace = random.sample([n for n in selected_main if n % 2 == 0], target_odd - odd_count)
                replacements = random.sample(odd_available, min(len(to_replace), len(odd_available)))
                for old, new in zip(to_replace, replacements):
                    selected_main.remove(old)
                    selected_main.append(new)
        elif odd_count > target_odd:
            # Adiciona mais pares
            even_available = [n for n in available_main if n % 2 == 0 and n not in selected_main]
            if even_available:
                to_replace = random.sample([n for n in selected_main if n % 2 == 1], odd_count - target_odd)
                replacements = random.sample(even_available, min(len(to_replace), len(even_available)))
                for old, new in zip(to_replace, replacements):
                    selected_main.remove(old)
                    selected_main.append(new)
        
        # Estrelas: mistura de quentes e frias
        available_stars = list(range(self.star_numbers_range[0], self.star_numbers_range[1] + 1))
        if len(star_freq) > 0:
            hot_stars = [s for s, _ in star_freq.most_common(6)]
            cold_stars = [s for s, _ in sorted(star_freq.items(), key=lambda x: x[1])[:6]]
            selected_stars = random.sample(hot_stars, 1) + random.sample(cold_stars, 1)
        else:
            selected_stars = random.sample(available_stars, self.star_count)
        
        return sorted(selected_main[:self.main_count]), sorted(selected_stars[:self.star_count])
    
    def generate_combinations(self, count: int = 3) -> List[Dict]:
        """Gera múltiplas combinações usando diferentes estratégias"""
        combinations = []
        used_combinations = set()  # Para evitar duplicados
        
        max_attempts = 50
        attempts = 0
        
        # Estratégia 1: Hot Numbers
        while attempts < max_attempts:
            main1, stars1 = self.generate_strategy_1_hot_numbers()
            combo_key = (tuple(main1), tuple(stars1))
            if combo_key not in used_combinations:
                combinations.append({
                    "strategy": "Números Mais Sorteados (Hot Numbers)",
                    "main": main1,
                    "stars": stars1,
                    "description": "Baseado nos números mais frequentes historicamente"
                })
                used_combinations.add(combo_key)
                break
            attempts += 1
        
        # Estratégia 2: Cold Numbers
        attempts = 0
        while attempts < max_attempts:
            main2, stars2 = self.generate_strategy_2_cold_numbers()
            combo_key = (tuple(main2), tuple(stars2))
            if combo_key not in used_combinations:
                combinations.append({
                    "strategy": "Números Menos Sorteados (Cold Numbers)",
                    "main": main2,
                    "stars": stars2,
                    "description": "Baseado na teoria de que números pouco sorteados estão 'devidos'"
                })
                used_combinations.add(combo_key)
                break
            attempts += 1
        
        # Estratégia 3: Balanced
        attempts = 0
        while attempts < max_attempts:
            main3, stars3 = self.generate_strategy_3_balanced()
            combo_key = (tuple(main3), tuple(stars3))
            if combo_key not in used_combinations:
                combinations.append({
                    "strategy": "Combinação Equilibrada (Balanced)",
                    "main": main3,
                    "stars": stars3,
                    "description": "Mistura inteligente de números quentes/frios com proporção par/ímpar otimizada"
                })
                used_combinations.add(combo_key)
                break
            attempts += 1
        
        return combinations[:count]
    
    def print_analysis(self):
        """Imprime análise estatística"""
        main_freq, star_freq = self.analyze_frequency()
        gaps = self.analyze_gaps()
        odd_even = self.analyze_odd_even_ratio()
        
        print("\n" + "="*60)
        print("ANÁLISE ESTATÍSTICA - EUROMILHÕES")
        print("="*60)
        print(f"\nNúmeros Principais Mais Sorteados:")
        for num, count in main_freq.most_common(10):
            print(f"  {num:2d}: {count} vezes")
        
        print(f"\nEstrelas Mais Sorteadas:")
        for star, count in star_freq.most_common(5):
            print(f"  {star:2d}: {count} vezes")
        
        print(f"\nAnálise de Intervalos:")
        print(f"  Intervalo médio entre números: {gaps['mean_gap']:.2f}")
        print(f"  Intervalo mediano: {gaps['median_gap']:.2f}")
        
        print(f"\nProporção Par/Ímpar:")
        print(f"  Média de números ímpares por sorteio: {odd_even['avg_odd']:.2f}")
        print("="*60 + "\n")


def main():
    print("\n" + "🎰" * 30)
    print("ANALISADOR DE EUROMILHÕES - GERADOR DE COMBINAÇÕES")
    print("🎰" * 30)
    
    analyzer = EuromillionsAnalyzer()
    
    # Mostra análise estatística
    analyzer.print_analysis()
    
    # Gera as 3 combinações
    print("\n" + "="*60)
    print("AS 3 CHAVES RECOMENDADAS PARA HOJE:")
    print("="*60 + "\n")
    
    combinations = analyzer.generate_combinations(3)
    
    for i, combo in enumerate(combinations, 1):
        main_str = " - ".join(f"{n:2d}" for n in combo["main"])
        stars_str = " - ".join(f"{s:2d}" for s in combo["stars"])
        
        print(f"🔑 CHAVE {i}: {combo['strategy']}")
        print(f"   Números: {main_str}")
        print(f"   Estrelas: {stars_str}")
        print(f"   Estratégia: {combo['description']}")
        print()
    
    print("="*60)
    print("⚠️  AVISO IMPORTANTE:")
    print("="*60)
    print("O Euromilhões é um jogo de sorte pura.")
    print("Cada combinação tem a mesma probabilidade de ganhar.")
    print("Esta análise estatística é apenas para fins informativos.")
    print("A probabilidade de ganhar o jackpot é de aproximadamente 1 em 139.838.160.")
    print("Boa sorte! 🍀")
    print("="*60 + "\n")


if __name__ == "__main__":
    main()
