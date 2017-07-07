class ReportResource < JSONAPI::Resource
  attributes :pdf, :tex, :tex_available, :examination_at, :created_at, :picture
  has_one :subject
  has_one :typ
  filters :typ, :subject
  filter :moduls,verify: ->(values, context) {
      werte=[]
      values.flatten.each do |elem| werte<<elem.to_i
      end
      werte
    }
  filter :folderseries,verify: ->(values, context) {
        werte=[]
        values.flatten.each do |elem| werte<<elem.to_i
        end
        werte
      }
  filter :examinators,verify: ->(values, context) {
        werte=[]
        values.flatten.each do |elem| werte<<elem.to_i
        end
        werte
      }
  def self.apply_filter(records, filter, value, options)
    p value
    case filter
    when "moduls.id"
        if value.is_a?(Array)
          value.each do |val|
            records = records.joins("INNER JOIN is_abouts m"+val.to_s+" ON m"+val.to_s+".report_id = reports.id").where("m"+val.to_s+".modul_id"=>val)
          end
          records
        else
          p value
          records.joins("INNER JOIN is_abouts m"+value.to_s+" ON m"+value.to_s+".report_id = reports.id").where("m"+value.to_s+".modul_id"=>value)
        end
      when "folderseries.id"
          if value.is_a?(Array)
            value.each do |val|
              records = records.joins("INNER JOIN is_ins m"+val.to_s+" ON m"+val.to_s+".report_id = reports.id").where("m"+val.to_s+".folderseries_id"=>val)
            end
            records
          else
            p value
            records.joins("INNER JOIN is_ins m"+value.to_s+" ON m"+value.to_s+".report_id = reports.id").where("m"+value.to_s+".folderseries_id"=>value)
          end
      when "examinators.id"
          if value.is_a?(Array)
            value.each do |val|
              records = records.joins("INNER JOIN examined_bies m"+val.to_s+" ON m"+val.to_s+".report_id = reports.id").where("m"+val.to_s+".examinator_id"=>val)
            end
            records
          else
            p value
            records.joins("INNER JOIN examined_bies m"+value.to_s+" ON m"+value.to_s+".report_id = reports.id").where("m"+value.to_s+".examinator_id"=>value)
          end
      else
        super(records, filter, value)
    end
  end
  has_many :examinators,acts_as_set:true
  has_many :moduls,acts_as_set: true
  has_many :folderseries,acts_as_set: true

  def tex_available
    @model.tex!=''
  end
  def fetchable_fields
    super - [:tex,:pdf]
  end
  def self.updatable_fields(context)
    super - [:tex_available]
  end
  def self.creatable_fields(context)
    super - [:tex_available]
  end
  before_save do
    @model.pdf = Base64.decode64(@model.pdf['data:application/pdf;base64,'.length .. -1])
  end
  def pdf
    @model.pdf
  end
end
