package utils.pagination

case class Paged[T](items: Seq[T], totalItems: Long, totalPages: Long, currentPage: Long, hasPreviousPage: Boolean, hasNextPage: Boolean)
