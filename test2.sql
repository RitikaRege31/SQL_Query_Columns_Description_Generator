CREATE TABLE product_sales_summary AS
SELECT 
    p.product_id,
    p.name AS product_name,
    SUM(oi.quantity * p.price) AS total_sales,
    SUM(oi.quantity) AS total_units_sold,
    SUM(oi.quantity * p.price) / NULLIF(SUM(oi.quantity), 0) AS avg_revenue_per_unit,
    SUM(oi.quantity * (p.price - p.manufacturing_cost)) AS total_profit,
    CASE 
        WHEN SUM(oi.quantity * p.price) > 0 
        THEN SUM(oi.quantity * (p.price - p.manufacturing_cost)) / SUM(oi.quantity * p.price)
        ELSE 0
    END AS profit_margin
FROM 
    products p
JOIN 
    order_items oi ON p.product_id = oi.product_id
GROUP BY 
    p.product_id, p.name