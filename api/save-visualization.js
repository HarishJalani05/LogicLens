module.exports = (req, res) => {
  if (req.method === 'POST') {
    const data = req.body;
    res.status(200).json({
      success: true,
      message: "Visualization logged successfully on Vercel.",
      entry: data
    });
  } else {
    res.status(200).json({ status: "LogicLens Vercel API Active" });
  }
};
