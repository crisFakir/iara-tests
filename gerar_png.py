#!/usr/bin/env python3
"""
Script para gerar marcas gráficas de Iara Carreira em PNG
Requer: pip install Pillow cairosvg
"""

import os
from PIL import Image, ImageDraw, ImageFont
import math

def criar_marca_principal():
    """Cria a marca principal com símbolo IC e nome"""
    # Criar imagem base
    width, height = 800, 400
    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Cores da marca
    azul = (0, 212, 255)
    rosa = (255, 107, 157)
    amarelo = (255, 217, 61)
    
    # Símbolo principal (círculo com IC)
    center_x, center_y = 200, 200
    radius = 80
    
    # Desenhar círculo com gradiente
    for i in range(radius):
        alpha = int(255 * (1 - i/radius))
        color = (
            int(azul[0] * (1 - i/radius) + rosa[0] * (i/radius)),
            int(azul[1] * (1 - i/radius) + rosa[1] * (i/radius)),
            int(azul[2] * (1 - i/radius) + rosa[2] * (i/radius)),
            alpha
        )
        draw.ellipse([center_x - i, center_y - i, center_x + i, center_y + i], 
                     fill=color, outline=color)
    
    # Adicionar texto IC
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 60)
    except:
        font = ImageFont.load_default()
    
    draw.text((center_x - 30, center_y - 30), "IC", fill=(255, 255, 255, 255), font=font)
    
    # Adicionar nome da marca
    try:
        font_nome = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 48)
    except:
        font_nome = ImageFont.load_default()
    
    # Nome com gradiente
    for i, char in enumerate("IARA CARREIRA"):
        x = 350 + i * 35
        y = 150
        color = (
            int(azul[0] * (1 - i/len("IARA CARREIRA")) + rosa[0] * (i/len("IARA CARREIRA"))),
            int(azul[1] * (1 - i/len("IARA CARREIRA")) + rosa[1] * (i/len("IARA CARREIRA"))),
            int(azul[2] * (1 - i/len("IARA CARREIRA")) + rosa[2] * (i/len("IARA CARREIRA"))),
            255
        )
        draw.text((x, y), char, fill=color, font=font_nome)
    
    # Tagline
    try:
        font_tag = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 24)
    except:
        font_tag = ImageFont.load_default()
    
    draw.text((350, 220), "INNOVATION • CREATIVITY • ARTISTRY", 
              fill=(0, 212, 255, 255), font=font_tag)
    
    return img

def criar_marca_simbolica():
    """Cria marca com letras individuais como símbolos"""
    width, height = 1000, 400
    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    azul = (0, 212, 255)
    rosa = (255, 107, 157)
    
    letras = "IARA CARREIRA"
    start_x = 50
    
    for i, letra in enumerate(letras):
        if letra == " ":
            start_x += 40
            continue
            
        x = start_x + i * 70
        y = 150
        
        # Desenhar quadrado com gradiente
        size = 60
        for j in range(size):
            alpha = int(255 * (1 - j/size))
            color = (
                int(azul[0] * (1 - j/size) + rosa[0] * (j/size)),
                int(azul[1] * (1 - j/size) + rosa[1] * (j/size)),
                int(azul[2] * (1 - j/size) + rosa[2] * (j/size)),
                alpha
            )
            draw.rectangle([x - j//2, y - j//2, x + size - j//2, y + size - j//2], 
                          fill=color, outline=color)
        
        # Adicionar letra
        try:
            font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 36)
        except:
            font = ImageFont.load_default()
        
        draw.text((x + 15, y + 15), letra, fill=(255, 255, 255, 255), font=font)
        start_x += 70
    
    return img

def criar_marca_geometrica():
    """Cria marca hexagonal geométrica"""
    width, height = 600, 600
    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    azul = (0, 212, 255)
    rosa = (255, 107, 157)
    amarelo = (255, 217, 61)
    
    center_x, center_y = 300, 300
    radius = 150
    
    # Desenhar hexágono externo
    hex_points = []
    for i in range(6):
        angle = i * math.pi / 3
        x = center_x + radius * math.cos(angle)
        y = center_y + radius * math.sin(angle)
        hex_points.append((x, y))
    
    # Preencher hexágono com gradiente
    for i in range(radius):
        alpha = int(255 * (1 - i/radius))
        color = (
            int(azul[0] * (1 - i/radius) + rosa[0] * (i/radius)),
            int(azul[1] * (1 - i/radius) + rosa[1] * (i/radius)),
            int(azul[2] * (1 - i/radius) + rosa[2] * (i/radius)),
            alpha
        )
        
        # Hexágono interno
        inner_points = []
        for j in range(6):
            angle = j * math.pi / 3
            x = center_x + (radius - i) * math.cos(angle)
            y = center_y + (radius - i) * math.sin(angle)
            inner_points.append((x, y))
        
        if len(inner_points) >= 3:
            draw.polygon(inner_points, fill=color, outline=color)
    
    # Hexágono interno
    inner_radius = 100
    inner_hex_points = []
    for i in range(6):
        angle = i * math.pi / 3
        x = center_x + inner_radius * math.cos(angle)
        y = center_y + inner_radius * math.sin(angle)
        inner_hex_points.append((x, y))
    
    # Preencher hexágono interno com gradiente
    for i in range(inner_radius):
        alpha = int(255 * (1 - i/inner_radius))
        color = (
            int(rosa[0] * (1 - i/inner_radius) + amarelo[0] * (i/inner_radius)),
            int(rosa[1] * (1 - i/inner_radius) + amarelo[1] * (i/inner_radius)),
            int(rosa[2] * (1 - i/inner_radius) + amarelo[2] * (i/inner_radius)),
            alpha
        )
        
        inner_inner_points = []
        for j in range(6):
            angle = j * math.pi / 3
            x = center_x + (inner_radius - i) * math.cos(angle)
            y = center_y + (inner_radius - i) * math.sin(angle)
            inner_inner_points.append((x, y))
        
        if len(inner_inner_points) >= 3:
            draw.polygon(inner_inner_points, fill=color, outline=color)
    
    # Adicionar texto IC
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 72)
    except:
        font = ImageFont.load_default()
    
    draw.text((center_x - 50, center_y - 30), "IC", fill=(255, 255, 255, 255), font=font)
    
    return img

def criar_marca_futurista():
    """Cria marca futurista circular"""
    width, height = 600, 600
    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    azul = (0, 212, 255)
    rosa = (255, 107, 157)
    amarelo = (255, 217, 61)
    
    center_x, center_y = 300, 300
    
    # Círculo externo
    radius_outer = 180
    for i in range(radius_outer):
        alpha = int(255 * (1 - i/radius_outer))
        color = (
            int(azul[0] * (1 - i/radius_outer) + amarelo[0] * (i/radius_outer)),
            int(azul[1] * (1 - i/radius_outer) + amarelo[1] * (i/radius_outer)),
            int(azul[2] * (1 - i/radius_outer) + amarelo[2] * (i/radius_outer)),
            alpha
        )
        draw.ellipse([center_x - i, center_y - i, center_x + i, center_y + i], 
                     fill=color, outline=color)
    
    # Círculo interno
    radius_inner = 120
    for i in range(radius_inner):
        alpha = int(255 * (1 - i/radius_inner))
        color = (
            int(rosa[0] * (1 - i/radius_inner) + amarelo[0] * (i/radius_inner)),
            int(rosa[1] * (1 - i/radius_inner) + amarelo[1] * (i/radius_inner)),
            int(rosa[2] * (1 - i/radius_inner) + amarelo[2] * (i/radius_inner)),
            alpha
        )
        draw.ellipse([center_x - i, center_y - i, center_x + i, center_y + i], 
                     fill=color, outline=color)
    
    # Círculo central
    radius_center = 60
    for i in range(radius_center):
        alpha = int(255 * (1 - i/radius_center))
        color = (
            int(azul[0] * (1 - i/radius_center) + rosa[0] * (i/radius_center)),
            int(azul[1] * (1 - i/radius_center) + rosa[1] * (i/radius_center)),
            int(azul[2] * (1 - i/radius_center) + rosa[2] * (i/radius_center)),
            alpha
        )
        draw.ellipse([center_x - i, center_y - i, center_x + i, center_y + i], 
                     fill=color, outline=color)
    
    # Adicionar texto IC
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 60)
    except:
        font = ImageFont.load_default()
    
    draw.text((center_x - 40, center_y - 25), "IC", fill=(255, 255, 255, 255), font=font)
    
    return img

def main():
    """Função principal para gerar todas as marcas"""
    print("🎨 Gerando marcas gráficas de Iara Carreira...")
    
    # Criar diretório para as imagens
    if not os.path.exists("marcas_png"):
        os.makedirs("marcas_png")
    
    # Gerar marca principal
    print("📝 Gerando marca principal...")
    marca_principal = criar_marca_principal()
    marca_principal.save("marcas_png/marca-principal-iara.png", "PNG")
    
    # Gerar marca simbólica
    print("🔤 Gerando marca simbólica...")
    marca_simbolica = criar_marca_simbolica()
    marca_simbolica.save("marcas_png/marca-simbolica-iara.png", "PNG")
    
    # Gerar marca geométrica
    print("🔷 Gerando marca geométrica...")
    marca_geometrica = criar_marca_geometrica()
    marca_geometrica.save("marcas_png/marca-geometrica-iara.png", "PNG")
    
    # Gerar marca futurista
    print("🚀 Gerando marca futurista...")
    marca_futurista = criar_marca_futurista()
    marca_futurista.save("marcas_png/marca-futurista-iara.png", "PNG")
    
    print("✅ Todas as marcas foram geradas com sucesso!")
    print("📁 Arquivos salvos na pasta 'marcas_png/'")
    print("\n📋 Arquivos gerados:")
    print("  • marca-principal-iara.png")
    print("  • marca-simbolica-iara.png")
    print("  • marca-geometrica-iara.png")
    print("  • marca-futurista-iara.png")

if __name__ == "__main__":
    main()