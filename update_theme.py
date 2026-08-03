import re
with open("assets/css/style.css", "r", encoding="utf-8") as f:
    css = f.read()

# Vars
css = css.replace("--text-light: #ffffff;", "--text-light: #333333;")
css = css.replace("--text-dim: #cccccc;", "--text-dim: #666666;")
css = css.replace("--bg-dark-overlay: rgba(0, 0, 0, 0.85);", "--bg-dark-overlay: rgba(255, 255, 255, 0.95);")
css = css.replace("--glass-bg: rgba(0, 0, 0, 0.9);", "--glass-bg: rgba(255, 255, 255, 0.9);")
css = css.replace("--glass-border: rgba(255, 255, 255, 0.1);", "--glass-border: rgba(0, 0, 0, 0.1);")
css = css.replace("--card-bg: rgba(20, 20, 20, 0.6);", "--card-bg: rgba(255, 255, 255, 0.8);")

# Background
body_css = """/* Background Handling */
body {
    background: #ffffff;
}

/* Dark Overlay */
body::before {
    display: none;
}"""
css = re.sub(r'/\* Background Handling \*/.*?(?=/\* --- TYPOGRAPHY --- \*/)', body_css + '\n\n', css, flags=re.DOTALL)

# Header
css = css.replace("background: rgba(0, 0, 0, 0.2);", "background: rgba(255, 255, 255, 0.9);")
css = css.replace("color: white;\n    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);", "color: var(--primary-color);\n    text-shadow: none;")

# Dropdown
css = css.replace("background: rgba(20, 20, 20, 0.95);", "background: rgba(255, 255, 255, 0.95);")
css = css.replace("background: rgba(255, 255, 255, 0.05);", "background: rgba(0, 0, 0, 0.05);")
css = css.replace("border-color: rgba(255, 255, 255, 0.2);", "border-color: rgba(0, 0, 0, 0.1);")
css = css.replace("background: rgba(10, 10, 10, 0.95);", "background: rgba(255, 255, 255, 0.95);")

# Produk Text (using more specific replace to avoid bad targets)
css = css.replace(".produk-text h3 {\n    font-size: 48px;\n    margin-bottom: 20px;\n    color: white;", ".produk-text h3 {\n    font-size: 48px;\n    margin-bottom: 20px;\n    color: var(--primary-color);")
css = css.replace("color: #ddd;", "color: #555;")

# Footer
css = css.replace("background: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.9) 100%);", "background: #f9f9f9;\n    border-top: 1px solid rgba(0, 0, 0, 0.1);")
css = css.replace("background: linear-gradient(90deg, #fff, #aaa);\n    -webkit-background-clip: text;\n    background-clip: text;\n    -webkit-text-fill-color: transparent;", "color: var(--primary-color);")
css = css.replace("color: white;\n    border-bottom: 2px solid var(--primary-color);", "color: #333;\n    border-bottom: 2px solid var(--primary-color);")
css = css.replace("border-top: 1px solid rgba(255, 255, 255, 0.1);", "border-top: 1px solid rgba(0, 0, 0, 0.1);")

# Slideshow
css = css.replace(".slideshow {\n    position: fixed;", ".slideshow {\n    display: none;\n    position: fixed;")

# Testimoni / Portfolio
css = css.replace("color: #fff;\n    text-transform: uppercase;\n    letter-spacing: 2px;\n    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);", "color: #333;\n    text-transform: uppercase;\n    letter-spacing: 2px;\n    text-shadow: none;")
css = css.replace("color: #ffd700;\n    margin: 0;\n    text-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);", "color: var(--primary-color);\n    margin: 0;\n    text-shadow: none;")
css = css.replace("background: rgba(0, 0, 0, 0.3);", "background: rgba(0, 0, 0, 0.05);")
css = css.replace("background: rgba(0, 0, 0, 0.2);", "background: rgba(0, 0, 0, 0.05);")
css = css.replace("color: #e0e0e0;", "color: #555;")
css = css.replace("border-left: 3px solid var(--primary-color);", "border-left: 5px solid var(--primary-color);")

# Year Cards
css = css.replace("color: #ffd700;\n    margin-bottom: 25px;\n    z-index: 1;\n    text-shadow: 0 4px 15px rgba(0, 0, 0, 0.6);", "color: var(--primary-color);\n    margin-bottom: 25px;\n    z-index: 1;\n    text-shadow: none;")
css = css.replace("color: #fff;\n    font-size: 24px;\n    /* Larger text */\n    z-index: 1;\n    opacity: 0.9;\n    font-weight: 500;", "color: #333;\n    font-size: 24px;\n    z-index: 1;\n    font-weight: 500;")
css = css.replace("color: #fff;\n    /* Optional: change color on hover */", "color: var(--primary-dark);")
css = css.replace("background-color: rgba(0, 0, 0, 0.95);", "background-color: rgba(255, 255, 255, 0.95);")

with open("assets/css/style.css", "w", encoding="utf-8") as f:
    f.write(css)

print("Update finished")
