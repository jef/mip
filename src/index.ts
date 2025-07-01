interface HandicapData {
  startingIndex: number;
  endingIndex: number;
}

interface ImprovementResult {
  improvementFactor: number;
  percentageImprovement: number;
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
    
    // Calculate percentage improvement from the factor
    const percentageImprovement = (improvementFactor - 1) * 100;
    
    return {
      improvementFactor: Math.round(improvementFactor * 10000) / 10000, // Round to 4 decimal places
      percentageImprovement: Math.round(percentageImprovement * 10) / 10
    };
  }
}

class HandicapSPA {
  private calculator: HandicapCalculator;
  private form!: HTMLFormElement;
  private resultsDiv!: HTMLDivElement;

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
                min="0" 
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
                min="0" 
                max="54"
                required
                placeholder="e.g., 15.2"
              />
            </div>
            
            <button type="submit" class="calculate-btn">Calculate Improvement</button>
          </form>
          
          <div id="results" class="results hidden">
            <h2>Improvement Results</h2>
            <div class="result-grid">
              <div class="result-item">
                <span class="result-label">Improvement Factor:</span>
                <span class="result-value" id="improvement-factor">-</span>
              </div>
              <div class="result-item">
                <span class="result-label">Percentage Improvement:</span>
                <span class="result-value" id="percentage-improvement">-</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    `;

    this.form = document.getElementById('handicap-form') as HTMLFormElement;
    this.resultsDiv = document.getElementById('results') as HTMLDivElement;
  }

  private bindEvents(): void {
    this.form.addEventListener('submit', (e: Event) => {
      e.preventDefault();
      this.handleCalculation();
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

    if (startingIndex < 0 || endingIndex < 0) {
      alert('Handicap indexes cannot be negative');
      return;
    }

    const results = this.calculator.calculateImprovementFactor({
      startingIndex,
      endingIndex
    });

    this.displayResults(results);
  }

  private displayResults(results: ImprovementResult): void {
    document.getElementById('improvement-factor')!.textContent = results.improvementFactor.toString();
    document.getElementById('percentage-improvement')!.textContent = `${results.percentageImprovement}%`;
    
    this.resultsDiv.classList.remove('hidden');
    this.resultsDiv.scrollIntoView({ behavior: 'smooth' });
  }
}

// Initialize the SPA when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new HandicapSPA();
});
