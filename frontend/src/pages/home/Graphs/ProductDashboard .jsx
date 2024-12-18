import React, { useState, useEffect } from "react";
import dashboardServices from "../../../services/dashboardServices";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Sector,
} from "recharts";

const ProductDashboard = () => {
    const [products, setProducts] = useState(null);
    const [highlightedCategory, setHighlightedCategory] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await dashboardServices.getStatistics("products");
            setProducts(response.products);
        } catch (error) {
            setProducts(null);
        }
    };

    const handleLegendClick = (e) => {
        const category = e.value;
        setHighlightedCategory((prev) => (prev === category ? null : category));
    };

    // Prepare category data
    const categoryDistributionData = products?.categoryDistribution?.map((category) => ({
        name: category._id,
        totalStock: category.totalStock,
    }));

    const COLORS = [
        "#3B82F6",
        "#10B981",
        "#6366F1",
        "#F43F5E",
        "#8B5CF6",
        "#F59E0B",
        "#6D28D9",
        "#0EA5E9",
        "#22D3EE",
        "#4ADE80",
    ];

    // Custom shape for active (highlighted) category
    const renderActiveShape = (props) => {
        const {
            cx,
            cy,
            midAngle,
            innerRadius,
            outerRadius,
            startAngle,
            endAngle,
            fill,
            payload,
        } = props;

        const RADIAN = Math.PI / 180;
        const sin = Math.sin(-RADIAN * midAngle);
        const cos = Math.cos(-RADIAN * midAngle);
        const sx = cx + (outerRadius + 10) * cos;
        const sy = cy + (outerRadius + 10) * sin;
        const mx = cx + (outerRadius + 30) * cos;
        const my = cy + (outerRadius + 30) * sin;
        const ex = mx + (cos >= 0 ? 1 : -1) * 22;
        const ey = my;

        return (
            <g>
                <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius + 10} // Increased size for highlighted category
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                />
                <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
                <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
                <text
                    x={ex + (cos >= 0 ? 1 : -1) * 12}
                    y={ey}
                    textAnchor={cos >= 0 ? "start" : "end"}
                    fill="#333"
                >
                    {`Stock: ${payload.totalStock}`}
                </text>
            </g>
        );
    };

    if (!products) return (<></>);

    return (
        <div className="min-h-screen p-6">
            <div className="container mx-auto">
                <div className='sticky top-[-10px] z-10 bg-blue-800 rounded-lg'>
                    <h1 className="text-3xl font-bold text-white mb-6 p-4">Product Analytics</h1>
                </div>

                <div>

                    {/* Top Selling Products Chart */}
                    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                        <h2 className="text-lg font-semibold text-center text-blue-700">Top Selling Products</h2>
                        <ResponsiveContainer width="100%" height={500} className='p-2'>
                            <BarChart layout="vertical" data={products.topSellingProducts}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" />
                                <Tooltip />
                                <Bar dataKey="salesCount" fill="#10B981" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Category Distribution Chart */}
                    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                        <h2 className="text-lg font-semibold text-center text-blue-700">
                            Stock by Category
                        </h2>
                        <div className="flex items-center justify-center">
                            <ResponsiveContainer width="100%" height={400}>
                                <PieChart>
                                    <Pie
                                        data={categoryDistributionData}
                                        dataKey="totalStock"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={150}
                                        activeIndex={categoryDistributionData?.findIndex(
                                            (entry) => entry.name === highlightedCategory
                                        )}
                                        activeShape={renderActiveShape}
                                        onClick={(data) => {
                                            const clickedCategory = data.name;
                                            setHighlightedCategory(
                                                clickedCategory === highlightedCategory
                                                    ? null
                                                    : clickedCategory
                                            );
                                        }}
                                    >
                                        {categoryDistributionData?.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={COLORS[index % COLORS.length]}
                                                opacity={
                                                    !highlightedCategory ||
                                                        highlightedCategory === entry.name
                                                        ? 1
                                                        : 0.3
                                                }
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend
                                        onClick={handleLegendClick}
                                        layout="vertical"
                                        verticalAlign="middle"
                                        align="right"
                                        wrapperStyle={{
                                            maxHeight: "300px",
                                            overflowY: "auto",
                                            paddingLeft: "20px",
                                            paddingRight: "20px",
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Top Selling Products Table */}
                <div className="bg-white shadow-md rounded-lg p-6 mt-6">
                    <h2 className="text-2xl font-semibold text-blue-700 mb-4">Top Selling Products</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-blue-100">
                                    <th className="p-3 text-left text-blue-800">Product Name</th>
                                    <th className="p-3 text-right text-blue-800">Price</th>
                                    <th className="p-3 text-right text-blue-800">Stock</th>
                                    <th className="p-3 text-right text-blue-800">Sales Count</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.topSellingProducts
                                    .sort((a, b) => b.salesCount - a.salesCount)
                                    .map((product, index) => (
                                        <tr
                                            key={index}
                                            className="border-b border-blue-200 hover:bg-blue-50 transition-colors"
                                        >
                                            <td className="p-3 text-blue-900">{product.name}</td>
                                            <td className="p-3 text-right text-blue-800">
                                                R{product.price.toLocaleString()}
                                            </td>
                                            <td className="p-3 text-right text-blue-800">
                                                {product.stock}
                                            </td>
                                            <td className="p-3 text-right text-blue-800">
                                                {product.salesCount}
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDashboard;