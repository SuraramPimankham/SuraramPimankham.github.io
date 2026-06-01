using CrudDotNet.Models;

namespace CrudDotNet.Services;

public interface IItemRepository
{
    IReadOnlyList<Item> GetAll();
    Item? GetById(int id);
    Item Create(ItemInput input);
    Item? Update(int id, ItemInput input);
    Item? Delete(int id);
}
