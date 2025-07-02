interface HandicapData {
  startingIndex: number;
  endingIndex: number;
}

interface ImprovementResult {
  improvementFactor: number;
}

interface TargetCalculation {
  targetEndingIndex: number;
}

class HandicapCalculator {
  /**
   * Calculate improvement factor based on USGA methodology
   * Formula: (start_index + 12) / (end_index + 12)
   */
  calculateImprovementFactor(data: HandicapData): ImprovementResult {
    const { startingIndex, endingIndex } = data;
    
    // USGA improvement factor formula
    const improvementFactor = (startingIndex + 12) / (endingIndex + 12);
    
    return {
      improvementFactor: Math.round(improvementFactor * 10000) / 10000 // Round to 4 decimal places
    };
  }

  /**
   * Calculate target ending handicap to beat a specific improvement factor
   */
  calculateTargetToWin(startingIndex: number, bestFactor: number): TargetCalculation {
    // To beat the best factor, we need a slightly higher factor
    const targetFactor = bestFactor + 0.001;
    
    // Solve for ending_index: ending_index = ((starting_index + 12) / target_factor) - 12
    const targetEndingIndex = ((startingIndex + 12) / targetFactor) - 12;
    
    return {
      targetEndingIndex: Math.round(targetEndingIndex * 10) / 10
    };
  }
}

class HandicapSPA {
  private calculator: HandicapCalculator;
  private form!: HTMLFormElement;
  private targetForm!: HTMLFormElement;
  private resultsDiv!: HTMLDivElement;
  private targetResultsDiv!: HTMLDivElement;

  constructor() {
    this.calculator = new HandicapCalculator();
    this.init();
  }

  private init(): void {
    this.createHTML();
    this.bindEvents();
  }

  private createHTML(): void {
    document.body.innerHTML = `
      <div class="container">
        <header>
          <h1>🏌️ USGA Most Improved Player Calculator</h1>
          <p>Calculate your Improvement Factor</p>
        </header>
        
        <main>
          <form id="handicap-form" class="form">
            <div class="form-group">
              <label for="starting-index">Starting Handicap Index:</label>
              <input 
                type="number" 
                id="starting-index" 
                name="startingIndex" 
                step="0.1" 
                min="-10" 
                max="54"
                required
                placeholder="e.g., 18.5"
              />
            </div>
            
            <div class="form-group">
              <label for="ending-index">Ending Handicap Index:</label>
              <input 
                type="number" 
                id="ending-index" 
                name="endingIndex" 
                step="0.1" 
                min="-10" 
                max="54"
                required
                placeholder="e.g., 15.2"
              />
            </div>
            
            <button type="submit" class="calculate-btn">Calculate Improvement</button>
          </form>
          
          <div id="results" class="results hidden">
            <h2>Improvement Results</h2>
            <div class="result-grid single-result">
              <div class="result-item">
                <span class="result-label">Improvement Factor:</span>
                <span class="result-value" id="improvement-factor">-</span>
              </div>
            </div>
          </div>

          <div class="section-divider">
            <h2>🎯 Target Calculator</h2>
            <p>Calculate what handicap you need to beat the current leader</p>
          </div>

          <form id="target-form" class="form">
            <div class="form-group">
              <label for="your-starting-index">Your Starting Handicap Index:</label>
              <input 
                type="number" 
                id="your-starting-index" 
                name="yourStartingIndex" 
                step="0.1" 
                min="-10" 
                max="54"
                required
                placeholder="e.g., 18.5"
              />
            </div>
            
            <div class="form-group">
              <label for="best-factor">Best Current Improvement Factor:</label>
              <input 
                type="number" 
                id="best-factor" 
                name="bestFactor" 
                step="0.001" 
                min="1"
                required
                placeholder="e.g., 1.286"
              />
              <small class="help-text">Enter the highest improvement factor you need to beat</small>
            </div>
            
            <button type="submit" class="calculate-btn target-btn">Calculate Target</button>
          </form>
          
          <div id="target-results" class="results hidden">
            <h2>Target Results</h2>
            <div class="result-grid single-result">
              <div class="result-item">
                <span class="result-label">Target Ending Index:</span>
                <span class="result-value" id="target-ending-index">-</span>
              </div>
            </div>
          </div>
        </main>
        
        <footer class="footer">
          <div class="footer-content">
            <p>
              <span class="footer-icon">⚡</span>
              Built with TypeScript & GitHub Pages
            </p>
            <p class="footer-links">
              <a href="https://github.com/jef/mip" target="_blank" rel="noopener noreferrer" class="footer-link">
                <span class="github-icon">📂</span>
                View Source Code
              </a>
              <span class="separator">•</span>
              <span class="footer-text">USGA MIP Calculator</span>
            </p>
          </div>
        </footer>
      </div>
    `;

    this.form = document.getElementById('handicap-form') as HTMLFormElement;
    this.targetForm = document.getElementById('target-form') as HTMLFormElement;
    this.resultsDiv = document.getElementById('results') as HTMLDivElement;
    this.targetResultsDiv = document.getElementById('target-results') as HTMLDivElement;
  }

  private bindEvents(): void {
    this.form.addEventListener('submit', (e: Event) => {
      e.preventDefault();
      this.handleCalculation();
    });

    this.targetForm.addEventListener('submit', (e: Event) => {
      e.preventDefault();
      this.handleTargetCalculation();
    });
  }

  private handleCalculation(): void {
    const formData = new FormData(this.form);
    const startingIndexValue = formData.get('startingIndex');
    const endingIndexValue = formData.get('endingIndex');

    if (!startingIndexValue || !endingIndexValue) {
      alert('Please enter values for both handicap indexes');
      return;
    }

    const startingIndex = parseFloat(startingIndexValue.toString());
    const endingIndex = parseFloat(endingIndexValue.toString());

    if (isNaN(startingIndex) || isNaN(endingIndex)) {
      alert('Please enter valid numbers for both handicap indexes');
      return;
    }

    if (startingIndex < -10 || endingIndex < -10) {
      alert('Handicap indexes cannot be lower than -10');
      return;
    }

    const results = this.calculator.calculateImprovementFactor({
      startingIndex,
      endingIndex
    });

    this.displayResults(results);
  }

  private handleTargetCalculation(): void {
    const formData = new FormData(this.targetForm);
    const startingIndexValue = formData.get('yourStartingIndex');
    const bestFactorValue = formData.get('bestFactor');

    if (!startingIndexValue || !bestFactorValue) {
      alert('Please enter values for both fields');
      return;
    }

    const startingIndex = parseFloat(startingIndexValue.toString());
    const bestFactor = parseFloat(bestFactorValue.toString());

    if (isNaN(startingIndex) || isNaN(bestFactor)) {
      alert('Please enter valid numbers for both fields');
      return;
    }

    if (startingIndex < -10 || bestFactor < 1) {
      alert('Starting index cannot be lower than -10 and improvement factor must be at least 1.0');
      return;
    }

    const results = this.calculator.calculateTargetToWin(startingIndex, bestFactor);
    this.displayTargetResults(results);
  }

  private displayResults(results: ImprovementResult): void {
    document.getElementById('improvement-factor')!.textContent = results.improvementFactor.toString();
    
    this.resultsDiv.classList.remove('hidden');
    this.resultsDiv.scrollIntoView({ behavior: 'smooth' });
  }

  private displayTargetResults(results: TargetCalculation): void {
    document.getElementById('target-ending-index')!.textContent = results.targetEndingIndex.toString();
    
    this.targetResultsDiv.classList.remove('hidden');
    this.targetResultsDiv.scrollIntoView({ behavior: 'smooth' });
  }
}

// Initialize the SPA when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new HandicapSPA();
});
