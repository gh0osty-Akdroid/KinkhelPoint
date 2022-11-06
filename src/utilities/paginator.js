
exports.getPagingData = async (items, page, limit) => {
    const { count: totalItems, rows: product } = items;
    const data = items.rows
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
    return { data, totalPages, currentPage };
};
exports.getPagination = async (page, size) => {
    const limit = size ? +size : 25;
    var offset;
    if (!page || page<=1) {
        offset = 0;
    }
    else {
        offset = (page - 1) * limit
    }
    return { limit, offset };
};

