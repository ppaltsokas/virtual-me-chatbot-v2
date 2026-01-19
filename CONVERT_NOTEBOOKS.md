# Converting Jupyter Notebooks to Markdown

## Why Markdown is Better Than PDF Images

1. **Text-based**: Contains actual text that can be searched and indexed
2. **Better AI processing**: LLMs can read and understand markdown much better than PDF images
3. **Smaller file size**: Markdown files are typically much smaller than PDFs
4. **Preserves code**: Code blocks remain executable and readable
5. **Version control friendly**: Easy to track changes in git

## Methods to Convert .ipynb to .md

### Method 1: Using Jupyter Notebook (Recommended)

1. Open your notebook in Jupyter
2. Go to **File → Download as → Markdown (.md)**
3. Save it in your `kb/` folder

### Method 2: Using Command Line (jupyter nbconvert)

```bash
# Install nbconvert if needed
pip install nbconvert

# Convert single notebook
jupyter nbconvert --to markdown "path/to/your/notebook.ipynb"

# Convert all notebooks in a folder
for file in *.ipynb; do
    jupyter nbconvert --to markdown "$file"
done
```

### Method 3: Using Python Script

Create a script `convert_notebooks.py`:

```python
import json
from pathlib import Path

def notebook_to_markdown(notebook_path, output_path=None):
    """Convert Jupyter notebook to markdown."""
    with open(notebook_path, 'r', encoding='utf-8') as f:
        notebook = json.load(f)
    
    markdown_lines = []
    
    for cell in notebook['cells']:
        if cell['cell_type'] == 'markdown':
            # Markdown cells - just add the content
            markdown_lines.extend(cell['source'])
            markdown_lines.append('\n')
        elif cell['cell_type'] == 'code':
            # Code cells - format as code blocks
            markdown_lines.append('```python\n')
            markdown_lines.extend(cell['source'])
            markdown_lines.append('\n```\n')
            
            # Add outputs if present
            if 'outputs' in cell and cell['outputs']:
                for output in cell['outputs']:
                    if output.get('output_type') == 'stream':
                        markdown_lines.append('```\n')
                        markdown_lines.extend(output.get('text', []))
                        markdown_lines.append('```\n')
                    elif output.get('output_type') == 'execute_result':
                        if 'text/plain' in output.get('data', {}):
                            markdown_lines.append('```\n')
                            markdown_lines.extend(output['data']['text/plain'])
                            markdown_lines.append('```\n')
            markdown_lines.append('\n')
    
    markdown_content = ''.join(markdown_lines)
    
    if output_path:
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(markdown_content)
    
    return markdown_content

# Example usage
if __name__ == '__main__':
    notebook_path = Path('your_notebook.ipynb')
    output_path = notebook_path.with_suffix('.md')
    notebook_to_markdown(notebook_path, output_path)
    print(f"Converted {notebook_path} to {output_path}")
```

### Method 4: Using VS Code

1. Open your `.ipynb` file in VS Code
2. Click the "..." menu in the notebook toolbar
3. Select "Export as Markdown"
4. Save to your `kb/` folder

## Recommended Folder Structure

After conversion, organize your files:

```
kb/
├── ML_projects/
│   ├── DAMA61_WA1_GANs.md          # Markdown version
│   ├── DAMA61_WA1_GANs.ipynb      # Keep original if needed
│   └── DAMA61_WA2_Neural_Networks.md
├── Data_Science_projects/
│   ├── Nobel_Prizes_Analysis.md
│   └── Space_Missions_Analysis.md
└── images/                          # For any charts/figures
    └── gan_results.png
```

## Tips for Better AI Processing

1. **Add clear headers**: Use markdown headers (#, ##, ###) to structure your content
2. **Include project descriptions**: Add a summary at the top of each file
3. **Preserve code outputs**: Include important outputs, metrics, and results
4. **Add metadata**: Include project name, date, and key technologies at the top
5. **Clean up**: Remove unnecessary cells or outputs before converting

## Example Markdown Structure

```markdown
# GANs on Fashion MNIST

**Project:** Generative Adversarial Networks  
**Date:** 2024  
**Technologies:** TensorFlow, Keras, Python  
**Objective:** Train GANs to generate synthetic Fashion MNIST images

## Introduction
[Your introduction here]

## Methodology
[Your methodology]

## Code Implementation

```python
# Your code here
import tensorflow as tf
...
```

## Results
- Discriminator accuracy: 0.68
- Generator loss: 2.3
- Training time: 2 hours

## Conclusion
[Your conclusions]
```

## After Conversion

1. Move `.md` files to appropriate folders in `kb/`
2. Restart your backend server to reload the knowledge base
3. Test by asking the chatbot about your projects
4. The AI should now have much better access to your project details!

