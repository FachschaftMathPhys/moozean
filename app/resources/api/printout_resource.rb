module Api
  class PrintoutResource < JSONAPI::Resource
    attributes :times, :uniid
    has_one :report
    after_save :print_document
    has_one :folderseries
    has_one :examinator
    def print_document
      @model.report.print_document @model.folderseries, @model.examinator, @model.times, @model.uniid
    end
  end
end
