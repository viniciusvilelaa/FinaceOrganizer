import PDFDocument from 'pdfkit';

//Function to build the PDF with transactions
export const buildTransactionsPDF = (doc ,transactions) => {

    //PDF Header
    doc.fontSize(20).fillColor("#2c3e50").text("Transactions report", {align: 'left'});
    doc.fontSize(10).fillColor("#7f8c8d").text(`Generated at: ${new Date().toLocaleDateString('pt-BR')}`, {align: 'left'});
    doc.moveDown();

    //Horizontal line diviser
    doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#bdc3c7').stroke();
    doc.moveDown(1.5);

    //Table Header
    const tableY = doc.y;
    doc.fontSize(10).fillColor("#2c3e50");
    doc.text("Date", 50, tableY);
    doc.text("Description", 120, tableY);
    doc.text("Category", 280, tableY);
    doc.text("Type", 380, tableY);
    doc.text("Amount", 450, tableY, {align: 'right'});
    
    //Line under table header
    doc.moveTo(50, tableY + 15).lineTo(545, tableY + 15).strokeColor("#2c3e50").stroke();

    let currentY = tableY + 25;

    //Fill pdf with transactions
    transactions.forEach((transaction) => {
        //Add page if exceed 750 height points
        if(currentY > 750){
            doc.addPage();
            currentY = 50;
        }

        const formattedDate = new Date(transaction.date).toLocaleDateString('pt-BR');
        const formattedAmount = new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(transaction.amount);

        const isIncome = transaction.type === 'INCOME';
        const typeText = isIncome ? 'Income' : 'Expense';
        const typeColor = isIncome ? '#27ae60' : '#c0392b';

        //Render text in cols
        doc.fillColor("#2c3e50");
        doc.text(formattedDate, 50, currentY);
        doc.text(transaction.description || '', 120, currentY, {width: 150, lineBreak: false});
        doc.text(transaction.category?.name || '', 280, currentY);
        doc.fillColor(typeColor).text(typeText, 380, currentY);
        doc.fillColor("#2c3e50").text(formattedAmount, 450, currentY, {align: 'right'});

        //Render line diviser
        doc.moveTo(50, currentY + 15).lineTo(545, currentY + 15).strokeColor("#ecf0f1").stroke();

        currentY += 25;
    });


    return doc;

} 