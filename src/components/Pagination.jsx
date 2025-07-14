import { Button, IconButton, Typography } from "@material-tailwind/react"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"

const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const getItemProps = (index) => ({
    variant: currentPage === index ? "filled" : "text",
    color: currentPage === index ? "blue" : "blue-gray",
    onClick: () => onPageChange(index),
    className: "rounded-full",
  })

  const next = () => {
    if (currentPage === totalPages) return
    onPageChange(currentPage + 1)
  }

  const prev = () => {
    if (currentPage === 1) return
    onPageChange(currentPage - 1)
  }

  const renderPageNumbers = () => {
    const pageNumbers = []
    const maxPageButtons = 5 // Max number of page buttons to show

    if (totalPages <= maxPageButtons) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(
          <IconButton key={i} {...getItemProps(i)}>
            {i}
          </IconButton>,
        )
      }
    } else {
      // Always show first page
      pageNumbers.push(
        <IconButton key={1} {...getItemProps(1)}>
          1
        </IconButton>,
      )

      // Show ellipsis if current page is far from start
      if (currentPage > 2 && currentPage > Math.floor(maxPageButtons / 2) + 1) {
        pageNumbers.push(
          <Typography key="ellipsis-start" className="px-2">
            ...
          </Typography>,
        )
      }

      // Show pages around the current page
      let startPage = Math.max(2, currentPage - Math.floor(maxPageButtons / 2) + 1)
      let endPage = Math.min(totalPages - 1, currentPage + Math.floor(maxPageButtons / 2) - 1)

      if (currentPage <= Math.floor(maxPageButtons / 2) + 1) {
        endPage = maxPageButtons - 1
      } else if (currentPage >= totalPages - Math.floor(maxPageButtons / 2)) {
        startPage = totalPages - maxPageButtons + 2
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(
          <IconButton key={i} {...getItemProps(i)}>
            {i}
          </IconButton>,
        )
      }

      // Show ellipsis if current page is far from end
      if (currentPage < totalPages - 1 && currentPage < totalPages - Math.floor(maxPageButtons / 2)) {
        pageNumbers.push(
          <Typography key="ellipsis-end" className="px-2">
            ...
          </Typography>,
        )
      }

      // Always show last page
      if (totalPages > 1) {
        pageNumbers.push(
          <IconButton key={totalPages} {...getItemProps(totalPages)}>
            {totalPages}
          </IconButton>,
        )
      }
    }
    return pageNumbers
  }

  if (totalItems === 0) return null // Don't show pagination if no items

  return (
    <div className="flex items-center gap-4">
      <Button
        variant="text"
        color="blue-gray"
        className="flex items-center gap-2 rounded-full"
        onClick={prev}
        disabled={currentPage === 1}
      >
        <FaChevronLeft strokeWidth={2} className="h-4 w-4" /> Previous
      </Button>
      <div className="flex items-center gap-2">{renderPageNumbers()}</div>
      <Button
        variant="text"
        color="blue-gray"
        className="flex items-center gap-2 rounded-full"
        onClick={next}
        disabled={currentPage === totalPages}
      >
        Next <FaChevronRight strokeWidth={2} className="h-4 w-4" />
      </Button>
    </div>
  )
}

export default Pagination;
