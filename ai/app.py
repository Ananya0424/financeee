from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import os
 
app = Flask(__name__)
CORS(app)
 
@app.route('/', methods=['GET'])
def health():
    return jsonify({"status": "Python AI service is running!"})
 
@app.route('/analyze', methods=['POST'])
def analyze():
    try:
        data = request.get_json()
        transactions = data.get('transactions', [])
        if not transactions:
            return jsonify({"insights": ["No transactions found."]})
        df = pd.DataFrame(transactions)
        insights = []
        expenses = df[df['type'] == 'expense']
        incomes = df[df['type'] == 'income']
        total_income = float(incomes['amount'].sum()) if not incomes.empty else 0
        total_expense = float(expenses['amount'].sum()) if not expenses.empty else 0
        balance = total_income - total_expense
        if total_income > 0:
            sp = ((total_income - total_expense) / total_income) * 100
            if sp < 20:
                insights.append("Warning: Your savings are only " + str(round(sp, 1)) + "% of your income!")
            else:
                insights.append("Great job! You are saving " + str(round(sp, 1)) + "% of your income!")
        if not expenses.empty:
            ce = expenses.groupby('category')['amount'].sum()
            insights.append("Highest expense category: " + str(ce.idxmax()) + " (Rs. " + str(round(float(ce.max()))) + ")")
        if total_expense > total_income:
            insights.append("Alert: Your expenses have exceeded your income!")
        else:
            insights.append("Good standing: Your net balance is positive at Rs. " + str(round(balance)))
        if not expenses.empty:
            ce = expenses.groupby('category')['amount'].sum()
            for cat, amt in ce.items():
                if total_income > 0:
                    pct = (float(amt) / total_income) * 100
                    if pct > 30:
                        insights.append("High spending alert: You spent " + str(round(pct, 1)) + "% of your income on " + str(cat) + ". Consider cutting back.")
        return jsonify({"insights": insights})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
 
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))   # Render automatically sets PORT
    app.run(host='0.0.0.0', port=port, debug=False)
